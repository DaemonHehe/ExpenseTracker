import mongoose from "mongoose"

interface CachedConnection {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var myMongoose: CachedConnection | undefined
}

const cached: CachedConnection = global.myMongoose || {
  conn: null,
  promise: null,
}

if (!global.myMongoose) {
  global.myMongoose = cached
}

async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable")
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
