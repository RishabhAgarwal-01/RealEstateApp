import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import {useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
function Header() {

  //redux state current user from the redux store
  const {currentUser} = useSelector((state)=> state.user)
  
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();


  const handleSubmit =(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm)
    const searchQuery= urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('serachTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  },[location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto p-3 space-y-3 sm:space-y-0">
        <Link to={'/'}>
        <h1 className="font-bold text-lg sm:text-xl flex flex-wrap cursor-pointer">
          <span className="text-slate-500">Dream</span>
          <span className="text-slate-700">Dwelling</span>
        </h1>
        </Link>
        <form
          className="bg-slate-100 p-2 rounded-lg flex items-center w-full sm:w-auto"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="search.."
            className="bg-transparent focus:outline-none w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-slate-300 hover:bg-slate-400 text-slate-600 p-2 rounded-lg ml-2">
            <FaSearch />
          </button>
        </form>
        <ul className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto items-center">
          <Link to="/">
            <li className="bg-slate-300 hover:bg-slate-400 text-slate-700 py-2 px-4 rounded-lg text-center w-full sm:w-auto">
              Home
            </li>
          </Link>
          <Link to="/search">
            <li className="bg-slate-300 hover:bg-slate-400 text-slate-700 py-2 px-4 rounded-lg text-center w-full sm:w-auto">
              Search
            </li>
          </Link>
          <Link to="/about">
            <li className="bg-slate-300 hover:bg-slate-400 text-slate-700 py-2 px-4 rounded-lg text-center w-full sm:w-auto">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-10 w-10 object-cover border border-slate-300"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="bg-slate-300 hover:bg-slate-400 text-slate-700 py-2 px-4 rounded-lg text-center w-full sm:w-auto">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
