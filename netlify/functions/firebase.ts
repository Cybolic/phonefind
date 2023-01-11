import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const serviceAccount = JSON.parse(process.env['firebase_admin']!)

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: `https://${process.env['firebase_db_url']!}.firebaseio.com`,
})
const auth = getAuth(app)
const db = getFirestore(app)

export default app
export { auth, db }
