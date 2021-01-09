import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import orphanages_dto from '../dtos/orphanages_dto';
import Orphanage from '../models/Orphanage';

import * as Yup from 'yup';

export default {
  async create(request: Request, response: Response) {
    const {
      id,
      nome,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = request.body;

    const orphanagesRepository = getRepository(Orphanage);

    const requestImages = request.files as Express.Multer.File[];

    const images = requestImages.map(img => {
      return { path: img.filename }
    });

    const data = {
      id,
      nome,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images
    };

    const schema = Yup.object().shape({
      nome: Yup.string().required('Nome é obrigatório'),
      latitude: Yup.number().required('Latitude é obrigatório'),
      longitude: Yup.number().required('Longitude é obrigatório'),
      about: Yup.string().required('Sobre é obrigatório').max(300),
      instructions: Yup.string().required('Instruções é obrigatório'),
      opening_hours: Yup.string().required('Horas em que está aberto é obrigatório'),
      open_on_weekends: Yup.boolean().required('Aberto nos fins de semana é obrigatório'),
      images: Yup.array(Yup.object().shape({
        path: Yup.string().required('Caminho da imagem'),
      }))
    });

    await schema.validate(data, {
      abortEarly: false
    });

    const orphanage = orphanagesRepository.create(data);

    await orphanagesRepository.save(orphanage);
    return response.status(201).json(orphanage);
  },

  async listAll(request: Request, response: Response) {

    const orphanagesRepository = getRepository(Orphanage);
    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    });
    return response.json(orphanages_dto.rendermany(orphanages));
  },

  async byId(request: Request, response: Response) {

    const orphanagesRepository = getRepository(Orphanage);
    const { id } = request.params;
    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    });
    return response.json(orphanages_dto.render(orphanage));
  },
}