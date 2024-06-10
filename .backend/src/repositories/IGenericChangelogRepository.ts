interface IGenericChangelogRepository<T, ID, CreateDTO> {
  create(data: CreateDTO): Promise<void>;
  findAllById(id: ID): Promise<T[]>;
}

export { IGenericChangelogRepository };
