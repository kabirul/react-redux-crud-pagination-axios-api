import React, { Component } from "react";
import { Link } from "react-router-dom";
import BlogDataService from "../services/BlogService";
import { FaPhabricator } from "react-icons/fa";

export default class Blog extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getTutorial = this.getTutorial.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateTutorial = this.updateTutorial.bind(this);
    this.deleteTutorial = this.deleteTutorial.bind(this);

    this.state = {
      currentBlog: {
        id: null,
        title: "",
        description: "",
        published: false
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getTutorial(this.props.match.params.id);
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function(prevState) {
      return {
        currentBlog: {
          ...prevState.currentBlog,
          title: title
        }
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value;
    
    this.setState(prevState => ({
      currentBlog: {
        ...prevState.currentBlog,
        description: description
      }
    }));
  }

  getTutorial(id) {
    BlogDataService.get(id)
      .then(response => {
        this.setState({
          currentBlog: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updatePublished(status) {
    var data = {
      id: this.state.currentBlog.id,
      title: this.state.currentBlog.title,
      description: this.state.currentBlog.description,
      published: status
    };

    BlogDataService.update(this.state.currentBlog.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentBlog: {
            ...prevState.currentBlog,
            published: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateTutorial() {
    BlogDataService.update(
      this.state.currentBlog.id,
      this.state.currentBlog
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The blog was updated successfully!"
        });
		this.props.history.push('/blogs')
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteTutorial() {    
    BlogDataService.delete(this.state.currentBlog.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/blogs')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentBlog } = this.state;

    return (
      <div>
        {currentBlog ? (
          <div className="list row">
             <div className="col-md-12">		  
             <h4>Edit Blog</h4>			
		      <Link to={"/blogs"} className="btn btn-sm btn-primary mb15"><FaPhabricator /> Blogs</Link>
	      
			
			
            <form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentBlog.title}
                  onChange={this.onChangeTitle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentBlog.description}
                  onChange={this.onChangeDescription}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentBlog.published ? "Published" : "Pending"}
              </div>
            </form>

            {currentBlog.published ? (
              <button
                className="btn btn-primary btn-sm mr-2"
                onClick={() => this.updatePublished(false)}
              >
                UnPublish
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm mr-2"
                onClick={() => this.updatePublished(true)}
              >
                Publish
              </button>
            )}

            <button
              className="btn btn-danger btn-sm mr-2"
              onClick={this.deleteTutorial}
            >
              Delete
            </button>

            <button
              type="submit"
              className="btn btn-success btn-sm"
              onClick={this.updateTutorial}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
		  </div>
        ) : (
          <div>
            <br />
            <p>Please click on a blog...</p>
          </div>
        )}
      </div>
    );
  }
}
