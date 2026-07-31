import { useState, useEffect } from 'react';
import { db } from './lib/firebase';
import { collection, onSnapshot, query, writeBatch, doc } from 'firebase/firestore';

interface InventoryItem {
  id: string;
  brand: string;
  model: string;
  marketPrice: number;
  floorPrice: number;
  platform: string;
  status: string;
}

export default function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'items'));
    return onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
      setItems(docs);
    }, (err) => {
      console.error("Firestore error:", err);
      setError(err);
    });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach(file => formData.append('images', file));
    formData.append('existingInventory', JSON.stringify(items));

    try {
      const response = await fetch('/api/process-images', {
        method: 'POST',
        body: formData,
      });

      const results = await response.json();
      
      // Save results to Firestore
      const batch = writeBatch(db);
      let hasUpdates = false;
      for (const item of results) {
        if (item.Status !== 'Duplicate') {
          const newDocRef = doc(collection(db, 'items'));
          batch.set(newDocRef, {
            ...item,
            ownerId: 'placeholder_user_id', // Should be auth.currentUser.uid
            createdAt: new Date().toISOString(),
          });
          hasUpdates = true;
        }
      }
      if (hasUpdates) {
        await batch.commit();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">DB Strategic Resale Engine</h1>
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          Error loading items: {error.message}
        </div>
      )}
      <input type="file" multiple onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Processing...</p>}
      
      <div className="mt-8 grid gap-4">
        {items.map(item => (
          <div key={item.id} className="p-4 border rounded shadow">
            <h2 className="font-bold">{item.brand} {item.model}</h2>
            <p>Market: ${item.marketPrice} | Floor: ${item.floorPrice}</p>
            <p>Platform: {item.platform}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
