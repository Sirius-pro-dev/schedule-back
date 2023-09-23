import { connect, disconnect } from '../db';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import ApiError from '../error/ApiError'

const tableScheme = new Schema({
    name: String,
});

const Table = mongoose.model("Table", tableScheme);

class TableController {
    static async getAll(req: any, res: any, next: any) {
        try {

            const tables = await Table.find({});

            return res.json(tables);
        } catch (e: any) {
            next(ApiError.badGateway(e.message))
        }
    }

}

export default TableController;
