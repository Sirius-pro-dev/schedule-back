import mongoose from 'mongoose';

export const connect = async () => {
    await mongoose.connect(`mongodb://${process.env.SIRIUS_X_MONGO_USERNAME}:${process.env.SIRIUS_X_MONGO_PASSWORD}@${process.env.SIRIUS_X_DB}:27017/${process.env.SIRIUS_X_MONGO_AUTHSOURCE ? `?authSource=${process.env.SIRIUS_X_MONGO_AUTHSOURCE}` : ''}`);
    console.log('mongo connect');
}

export const disconnect = async () => {
    await mongoose.disconnect();
    console.log('mongo disconnect');
}