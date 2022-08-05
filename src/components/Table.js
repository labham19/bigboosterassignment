import axios from 'axios';
import React, { useEffect, useState } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Table = () => {
  const [form,setForm] = useState({}); //Form state
  const [currentIndex,setCurrentIndex] = useState(null);  //Holds index of task being currently edited or deleted
  const [currentId,setCurrentId] = useState(null);
  const [data,setData] = useState([]);

  useEffect(()=>{
    axios.get('https://jsonplaceholder.typicode.com/users')
    .then((res)=>{
        setData(res.data);
    })
    .catch(err=>console.log(err));
  },[]);

  const formChangeHandler = (event) => {
    setForm({...form,[event.target.name]: event.target.value});  
  }; 

  const addNew = async(e) =>{
    e.preventDefault();
    
    let validate = await validation();
    console.log(validate);
    if(!validate.status){
      toast.error(validate.msg);
      return;
    }

    axios.post('https://jsonplaceholder.typicode.com/users',form)
    .then((res)=>{
        setData((pre)=>{
            return [...pre,res.data];
        });
        document.getElementsByClassName('modal-close-btn')[0].click();
        reset();
        toast.success("Added successfully!");
    })
    .catch(err=>console.log(err)); 
  }

  const deleteItem = (e) =>{
    e.preventDefault();

    axios.delete('https://jsonplaceholder.typicode.com/users/'+currentId)
    .then((res)=>{
        document.getElementsByClassName('modal-close-btn')[1].click();
        let d = data;
        d.splice(currentIndex,1);
        setData(d);
        reset();
        toast.success("Deleted successfully!");
    })
    .catch(err=>console.log(err));
  }

  //Resets form and index
  const reset = ()=>{
    setForm({});
    setCurrentIndex(null);
    setCurrentId(null);
  }

  const validation = async()=>{
    const phoneReg = /^\d{10}$/;

    const websiteReg = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/;

    const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    let response = {status:true,msg:""};

    if(!form.email.match(emailReg,'i')){
      response.status = false;
      response.msg = "Recheck Email Address";
    }
    else if(!form.website.match(websiteReg,'g')){
      response.status = false;
      response.msg = "Recheck Website URL";
    }
    else if(!form.phone.match(phoneReg)){
      response.status = false;
      response.msg = "Recheck Phone Number";
    }

    return response;
  }

  return (
      <div className='p-2 table-container m-5'>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col"><button type="button" className="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addModal">Add New</button></th>
              <th scope="col">Name</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Website</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((item,i)=>{
                return <tr key={i}>
                    <th scope="row">{i+1}</th>
                    <td>{item.name}</td>
                    <td>{item.username}</td>
                    <td><a href={`mailto:${item.email}`}>{item.email}</a> </td>
                    <td><a href={`tel:${item.phone}`}>{item.phone}</a></td>
                    <td><a target="_blank" href={item.website}>{item.website}</a></td>
                    <td><i className="fa fa-trash" aria-hidden="true" onClick={(i)=>{setCurrentIndex(i);setCurrentId(item.id)}} data-bs-toggle="modal" data-bs-target="#deleteModal"></i></td>
                </tr>
              })
            }
            
          </tbody>

        </table>


        <div className="modal modal-lg fade text-white" id="addModal" tabIndex="-1"  aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add New Item</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={addNew}>
            <div className="modal-body row">
            <div className="mb-3 col-md-6">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input type="text" required minLength={3} name='name' className="form-control" value={form.name?form.name:""} onChange={formChangeHandler} placeholder='Full Name' id="name"  />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" required minLength={3} name='username' className="form-control" value={form.username?form.username:""} onChange={formChangeHandler} placeholder='Username' id="username"  />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="text" required name='email' className="form-control" value={form.email?form.email:""} onChange={formChangeHandler} placeholder='Email Address' id="email"  />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input type="text" required name='phone' className="form-control" value={form.phone?form.phone:""} onChange={formChangeHandler} id="phone" placeholder='Phone Number' />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="website" className="form-label">Website</label>
                <input type="text" required name='website' className="form-control" value={form.website?form.website:""} onChange={formChangeHandler} id="website" placeholder='https://www.xyz.com' />
            </div>
            </div>

            <div className="modal-footer">
                <button type="button" className="btn btn-secondary modal-close-btn" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Add New</button>
            </div>
            </form>
            </div>
        </div>

        </div>
        <div className="modal modal-lg fade text-white" id="deleteModal" tabIndex="-1"  aria-hidden="true" >
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Delete Item</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={deleteItem}>
            <div className='modal-body'>
                The selected item will be deleted. Are you sure ?   
            </div>

            <div className="modal-footer">
                <button type="button" className="btn btn-secondary modal-close-btn" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-outline-danger"> Confirm</button>
            </div>
            </form>
            </div>
        </div>

        </div>

        <ToastContainer autoClose={1400} hideProgressBar={true}/>
    </div>
  )
}

export default Table
