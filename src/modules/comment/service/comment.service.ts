import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {CommentServiceInterface} from './comment-service.interface.js';
import {Component} from '../../../types/component.types.js';
import {CommentEntity} from '../comment.entity.js';
import CreateCommentDto from '../dto/create-comment.dto.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {
  }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('userId');
  }

  public async findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({movieId})
      .populate('userId');
  }

  public async deleteByMovieId(movieId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({movieId})
      .exec();

    return result.deletedCount;
  }
}
