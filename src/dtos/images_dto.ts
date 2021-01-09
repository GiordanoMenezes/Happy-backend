import Image from "../models/Image";

export default {
  render(image: Image) {
    return {
      id: image.id,
      url: `http://localhost:5000/uploads/${image.path}`,
    }
  },

  rendermany(images: Image[]) {
    return images.map(image => this.render(image));
  }
}