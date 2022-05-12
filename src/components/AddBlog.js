import React, { Component } from "react";
import { Link } from "react-router-dom";
import BlogDataService from "../services/BlogService";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaPhabricator } from "react-icons/fa";


export default class AddBlog extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveBlog = this.saveBlog.bind(this);
    this.newBlog = this.newBlog.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	
    this.state = {
      id: null,
      title: "",
      description: "", 
      published: false,
      submitted: false
    };
  }
     
  validationSchema() {
    return Yup.object().shape({
      title: Yup.string().required('Title is required'),
	  description: Yup.string().required('Description is required'),   
    });
  }
   
  

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }
  
  handleSubmit(data) {
    console.log(JSON.stringify(data, null, 2));
  }
  

  saveBlog() {
	  
	//console.log(JSON.stringify(this.state));  
	  
    var data = {
      title: this.state.title,
      description: this.state.description
    };

    BlogDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          published: response.data.published,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newBlog() {
    this.setState({
      id: null,
      title: "",
      description: "",
      published: false,

      submitted: false
    });
  }

  render() {
	  
	  const initialValues = {
				  title:this.state.title,
				  description:this.state.description,    
       };
	  
	  
    return (
       <div className="list row">
        <div className="col-md-12">
	  
	       <h4>Add Blog</h4>	
		   <Link to={"/blogs"} className="btn btn-sm btn-primary mb15"><FaPhabricator /> Blogs</Link>
	       
	  
	  <Formik enableReinitialize={true} initialValues={initialValues} validationSchema={this.validationSchema} onSubmit={this.handleSubmit}>
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newBlog}>Add</button>
          </div>
        ) : (
          <div>
		  <Form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <Field
                type="text"
                className="form-control"
                id="title"
                required
                value={this.state.title}
                onChange={this.onChangeTitle}
                name="title"
              />
			  <ErrorMessage name="title" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <Field
			    as="textarea"               
                className="form-control"
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
              />
			  <ErrorMessage name="description" component="div" className="text-danger" />
            </div>
            <button type="button" onClick={this.saveBlog} className="btn btn-success">Submit</button>
			</Form>
          </div>
        )}
		</Formik>
      </div>
	  </div>
    );
  }
}
