import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);
const dbName = 'college_predictor';
const collectionName = 'cutoffs';


export async function POST(req: NextRequest) {
  try {
    const { percentage, category, course, location } = await req.json();
    console.log("Received input:", { percentage, category, course, location });


    if (!percentage || !category || !course) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const col = db.collection(collectionName);

    const query: any = {
  course: { $regex: `^${course}$`, $options: 'i' }, // exact match, case-insensitive
  category: { $regex: `^${category}$`, $options: 'i' },
  cutoff: { $lte: parseFloat(percentage) }
};
const distinctCourses = await col.distinct("course");
console.log("📚 All distinct courses in DB:", distinctCourses);
const sample = await col.findOne();
console.log("🧾 Sample document:", sample);



if (location) {
  query.college = { $regex: location, $options: 'i' };
}



    if (location) {
      query.college = { $regex: location, $options: 'i' };
    }

    const results = await col.find(query).toArray();
    console.log('Matched colleges:', results.length);


    return NextResponse.json(results);
  } catch (err) {
    console.error('Prediction API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}
