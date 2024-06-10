interface IGenericRepository<T, ID, CreateDTO, UpdateDTO> {
  create(data: CreateDTO): Promise<void>;
  findById(id: ID): Promise<T | null>;
  update(id: ID, data: Partial<UpdateDTO>): Promise<void>;
  delete(id: ID): Promise<void>;
}

export { IGenericRepository };
