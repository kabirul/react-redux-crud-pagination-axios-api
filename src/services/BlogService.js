import http from "./HttpService";

class BlogDataService {
  getAll(params) {
    return http.get("/blogs",{ params });
  }

  get(id) {
    return http.get("/blogs/"+id);
  }

  create(data) {
    return http.post("/blogs", data);
  }

  update(id, data) {
    return http.put("/blogs/"+id, data);
  }

  delete(id) {
    return http.delete("/blogs/"+id);
  }

  deleteAll() {
    return http.delete("/blogs");
  }

  findByTitle(title) {
    return http.get("/blogs?title="+title);
  }
}

export default new BlogDataService();