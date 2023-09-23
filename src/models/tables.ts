import mongoose from 'mongoose';
import {saveModel} from '../db';

export const createModels = () => {
    const Table = mongoose.model('Table', new mongoose.Schema({ name: String }));
    
    const table = new Table({ name: 'Таблица 1' });
    saveModel(table);
}