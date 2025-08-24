# MongoDB Connection Options

You can use one of the following options to connect to MongoDB:

## Option 1: MongoDB Atlas (Cloud)

1. Sign up for a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (the free tier is sufficient)
3. Click on "Connect" and select "Connect your application"
4. Copy the connection string and replace it in your `.env` file:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.example.mongodb.net/secret-santa?retryWrites=true&w=majority
```

Replace `username`, `password`, and the cluster address with your own values.

## Option 2: Local MongoDB with Docker

1. Make sure Docker is installed on your system
2. Run the following command to start MongoDB in a Docker container:

```bash
docker-compose up -d
```

3. Update your `.env` file with:

```
MONGODB_URI=mongodb://root:example@localhost:27017/secret-santa?authSource=admin
```

4. You can access the MongoDB admin interface at: http://localhost:8081

## Option 3: Install MongoDB Locally

1. Follow the MongoDB installation guide for your OS:
   - Mac: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
   - Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
   - Linux: https://docs.mongodb.com/manual/administration/install-on-linux/

2. Start the MongoDB service
3. Keep the default connection string in your `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/secret-santa
```

## Testing the Connection

Regardless of which option you choose, you can test the connection by running:

```bash
npm run dev
```

And checking that the console shows "MongoDB connected successfully".
