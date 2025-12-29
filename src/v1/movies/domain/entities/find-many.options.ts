export type FindManyOptions = {
  sort?: 'id' | 'title' | 'year';
  order?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
};
