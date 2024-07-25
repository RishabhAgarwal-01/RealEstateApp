import { getDownloadURL, getStorage, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { app } from "../firebase";
import { ref } from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateListing() {
    
    //takes the image files
    const [files, setFiles]= useState([]);

    //form data to manage the input fields
    const [formData, setFormData]= useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });

    //it sets the error that happens during the uploading of images
    const [imageUploadError, setImageUploadError] = useState(null);
    //this state keep track of whether the image is being uploaded or deleted so that we can disable the upload image button
    const [uploading, setUploading] = useState(false);

    //keep track of error in the create listing used in handleSubmit
    const [error, setError] = useState(false);
    //set Loading for loading effect in create listing or form submit event
    const [loading, setLoading] = useState(false)

    const {currentUser} = useSelector((state)=> state.user);

    const navigate = useNavigate();

    // console.log(formData);

    //handleImage submit
    const handleImageSubmit = (e) => {
        //checks the number of files
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
          setUploading(true);
          setImageUploadError(false);
          const promises = [];
    
          for (let i = 0; i < files.length; i++) {
            promises.push(storeImage(files[i])); //pushing the resolved urls after it get upload into the firebase 
          }
          Promise.all(promises) //Promise wait for all images to get resolved then storing the each urls of promises array into formData.imageUrls
            .then((urls) => {
              setFormData({
                ...formData,
                imageUrls: formData.imageUrls.concat(urls),
              });
              setImageUploadError(false);
              setUploading(false);
            })
            .catch((err) => {
              setImageUploadError('Image upload failed (2 mb max per image)');
              setUploading(false);
            });
           } else {
          setImageUploadError('You can only upload 6 images per listing');
          setUploading(false);
             console.log("You can only upload 6 images per listing")
           }
      };

     //storeImage
     const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage(app);
          const fileName = new Date().getTime() + file.name;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      };

      //remove image functionality
      const handleRemoveImage = (index)=>{
        setFormData({
            ...formData,
             imageUrls : formData.imageUrls.filter((url, i)=> i !== index)
        })
      }

      //handleChange
      const handleChange=(e)=>{
          if(e.target.id === 'sale' || e.target.id==="rent"){
            setFormData({
                ...formData,
                type: e.target.id
            })
          } 
          if (e.target.id === 'parking' || e.target.id === 'furnished' ||e.target.id === 'offer') {
            setFormData({
              ...formData,
              [e.target.id]: e.target.checked,
            });
          }
      
          if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
              ...formData,
              [e.target.id]: e.target.value,
            });
          }
      }

      //handle submit 
      const handleSubmit = async(e)=>{
         e.preventDefault();
         try {
            if (formData.imageUrls.length < 1)
                return setError('You must upload at least one image');
              if (+formData.regularPrice < +formData.discountPrice)
                return setError('Discount price must be lower than regular price');
            setLoading(true);
            setError(false);
            const res= await fetch('/api/listing/create',{
              method: 'POST',
              headers:{
                'Content-Type' : 'application/json',
              },
              body:JSON.stringify({
                ...formData,
                userRef: currentUser._id,
              })
            })
            const data= await res.json()
            setLoading(false)
            if(data.success ===false){
                setError(data.message);
            }
            navigate(`/listing/${data._id}`)
         } catch (error) {
            setError(error.message);
            setLoading(false);
         }
      }

    return (
        //main div covering whole
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className="text-3xl font-semibold text-center my-7">
                Create a Listing
            </h1>
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
                {/*Right div*/}
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                        type='text'
                        placeholder='Name'
                        className='border p-3 rounded-lg'
                        id='name'
                        maxLength='62'
                        minLength='10'
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <textarea
                        type='text'
                        placeholder='Description'
                        className='border p-3 rounded-lg'
                        id='description'
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <input
                        type='text'
                        placeholder='Address'
                        className='border p-3 rounded-lg'
                        id='address'
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='sale'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.type === 'sale'}
                            />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='rent'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='parking'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.parking}
                            />
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='furnished'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='offer'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='bedrooms'
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange}
                                value={formData.bedrooms}
                            />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='bathrooms'
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange}
                                value={formData.bathrooms}
                            />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='regularPrice'
                                min='500000'
                                max='100000000'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange}
                                value={formData.regularPrice}
                            />
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                {formData.type === 'rent' && (
                                    <span className='text-xs'>(₹ / month)</span>
                                )}
                            </div>
                        </div>
                          {formData.offer && ( 
                            <div className='flex items-center gap-2'>
                                <input
                                    type='number'
                                    id='discountPrice'
                                    min='0'
                                    max='10000000'
                                    required
                                    className='p-3 border border-gray-300 rounded-lg'
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                />
                                <div className='flex flex-col items-center'>
                                    <p>Discounted price</p>

                                    {formData.type === 'rent' && (
                                        <span className='text-xs'>(₹/ month)</span>
                                    )}
                                </div>
                            </div>
                         )}
                    </div>
                </div>

                {/*Left div*/}
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>
                        Images:
                        <span className='font-normal text-gray-600 ml-2'>
                            The first image will be cover (max 6)
                        </span>
                    </p>
                    <div className='flex gap-4'>
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            className='p-3 border border-gray-300 rounded w-full'
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                        />
                        <button
                            type='button'
                            disabled={uploading}
                            onClick={handleImageSubmit}
                            className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    <p className='text-red-700 text-sm'>
                         {imageUploadError && imageUploadError}
                    </p>
                    
                    {formData.imageUrls.length >0 && formData.imageUrls.map((url, index)=>(
                        <div key={url}
                             className='flex justify-between p-3 border items-center' >
                            <img src={url} alt="listing image" 
                                className='w-20 h-20 object-contain rounded-lg'
                            />
                             <button
                                type='button'
                                onClick={() => handleRemoveImage(index)}
                                className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                             >
                                   Delete
                            </button>
                        </div>

                    ))}

                    <button
                        disabled={loading || uploading}
                        className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                    >
                         {loading ? 'Creating...' : 'Create listing'}
                    </button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
            </form>
        </main>
    );
}

export default CreateListing;
