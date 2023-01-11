import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'
import { getAuth } from 'firebase/auth'
import { environment } from '../environments/environment'

const firebaseConfig = environment.firebase

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export default app
export { auth, db, collection, getDocs }
