import Orphanage from "../models/Orphanage";
import images_dto from "./images_dto";

export default {
  render(orphanage: Orphanage) {
    return {
      id: orphanage.id,
      nome: orphanage.nome,
      latitude: orphanage.latitude,
      longitude: orphanage.longitude,
      about: orphanage.about,
      instructions: orphanage.instructions,
      opening_hours: orphanage.opening_hours,
      open_on_weekends: orphanage.open_on_weekends,
      images: images_dto.rendermany(orphanage.images),
    }
  },

  rendermany(orphanages: Orphanage[]) {
    return orphanages.map(orphanage => this.render(orphanage));
  }
}