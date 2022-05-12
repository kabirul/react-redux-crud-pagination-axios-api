import React, { Component } from "react";
import BlogDataService from "../services/BlogService";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table"
import { FaEdit,FaTrash,FaPhabricator,FaPlusSquare } from "react-icons/fa";
import Pagination from "@material-ui/lab/Pagination";


export default class BlogsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveBlogs = this.retrieveBlogs.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveBlog = this.setActiveBlog.bind(this);
    this.removeAllBlogs = this.removeAllBlogs.bind(this);
    this.searchTitle = this.searchTitle.bind(this);
	this.deleteBlog = this.deleteBlog.bind(this);
	this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
	
    this.state = {
      blogs: [],
      currentBlog: null,
      currentIndex: -1,
      searchTitle: "",
	  page: 1,
      count: 0,
      pageSize: 5,
    };
	
	this.pageSizes = [5, 10, 15];
	
  }

  componentDidMount() {
    this.retrieveBlogs();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }
  
  getRequestParams(searchTitle, page, pageSize) {
    let params = {};
    if(searchTitle) {
      params["title"] = searchTitle;
    }
    if (page) {
      params["page"] = page - 1;
    }
    if (pageSize) {
      params["size"] = pageSize;
    }
    return params;
  }
  

  retrieveBlogs() {
	  
	 const { searchTitle, page, pageSize } = this.state;  
	 const params = this.getRequestParams(searchTitle, page, pageSize); 	  
	 console.log("params",params);		  
	  
    BlogDataService.getAll(params)
      .then(response => {			
		const {blogs,totalPages}=response.data;
		
        this.setState({
          blogs: blogs,
		  count: totalPages,
        });
		
        
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveBlogs();
    this.setState({
      currentBlog: null,
      currentIndex: -1
    });
  }

  setActiveBlog(blog, index) {
    this.setState({
      currentBlog: blog,
      currentIndex: index
    });
  }

  removeAllBlogs() {
    BlogDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }
  
  deleteBlog(id) {    
    BlogDataService.delete(id)
      .then(response => {
        console.log(response.data);
         this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }
  

  searchTitle() {
    this.setState({
      currentBlog: null,
      currentIndex: -1
    });

    BlogDataService.findByTitle(this.state.searchTitle)
      .then(response => {
        this.setState({
          blogs: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  
   handlePageChange(event, value) {
    this.setState(
      {
        page: value,
      },
      () => {
        this.retrieveBlogs();
      }
    );
  }

  handlePageSizeChange(event) {
    this.setState(
      {
        pageSize: event.target.value,
        page: 1
      },
      () => {
        this.retrieveBlogs();
      }
    );
  }  
   

  render() {
    const { blogs,currentBlog,currentIndex,searchTitle,page,count,pageSize, } = this.state;

    return (
      <div className="list row">
        <div className="col-md-6">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-12">
           <h4>Blogs List</h4>	
		   
		   <div className="mt-3">
            {"Items per Page: "}
            <select onChange={this.handlePageSizeChange} value={pageSize}>
              {this.pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <Pagination
              className="my-3"
              count={count}
              page={page}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              onChange={this.handlePageChange}
            />
          </div>
		   
		   
		   <Link to={"/add"} className="btn btn-sm btn-primary"><FaPlusSquare /> Add Blog</Link>
		   <button className="m-3 btn btn-sm btn-danger" onClick={this.removeAllBlogs}><FaTrash /> Remove All</button>
		  <Table striped bordered hover>
		  <thead>
			<tr>
			  <th width="8%">#</th>
			  <th width="26%">Title</th>
			  <th width="40%">Description</th>
			  <th width="14%">Status</th>
			  <th width="12%">Action</th>
			</tr>
		  </thead>
		  <tbody>
		   {blogs && blogs.map((blog, index) => (
			<tr>
			  <td>{index+1}</td>
			  <td className={"list-group-item " + (index === currentIndex ? "active" : "")} onClick={() => this.setActiveBlog(blog, index)} key={index}>{blog.title}</td>
			  <td>{blog.description}</td>
			  <td>{blog.published ? "Published" : "Pending"}</td>
			  <td>
			     <Link to={"#"} onClick={() => this.setActiveBlog(blog, index)} key={index} className="pdr5"><FaPhabricator /></Link>
			     <Link to={"/blogs/" + blog.id} className="pdr5"><FaEdit /></Link>				
				 <Link to={"#"} onClick={() => this.deleteBlog(blog.id)}><FaTrash /></Link>  			   
			  </td>
			</tr>
             ))}
          </tbody>
        </Table>  
         
        </div>
        <div className="col-md-12">
          {currentBlog ? (
            <div>
              <h4>Blog Details</h4>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {currentBlog.title}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentBlog.description}
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentBlog.published ? "Published" : "Pending"}
              </div>             
            </div>
          ) : (
            <div>              
            </div>
          )}
        </div>
      </div>
    );
  }
}
