'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')

  useEffect(() => {
    async function checkConnection() {
      try {
        // Test database connection by querying plants table
        const { data, error } = await supabase
          .from('plants')
          .select('id')
          .limit(1)

        if (error) {
          console.error('Database connection error:', error)
          setDbStatus('error')
        } else {
          setDbStatus('connected')
        }
      } catch (error) {
        console.error('Database connection error:', error)
        setDbStatus('error')
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-primary-800">
            🌱 Hello World
          </h1>
          <p className="text-xl text-earth-600">
            Welcome to your House Plants App!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-primary-700 mb-4">
            Your Digital Plant Journal
          </h2>
          <p className="text-earth-600 leading-relaxed">
            Ready to start your plant care journey:
          </p>
          <ul className="mt-4 space-y-2 text-left text-earth-600">
            <li>• Add plants to your collection</li>
            <li>• Track watering and care events</li>
            <li>• Monitor plant health and growth</li>
            <li>• Upload photos of your plants</li>
          </ul>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <a href="/plants" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-center">
              My Plant Collection
            </a>
            <a href="/library" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-center">
              Plant Library
            </a>
            <a href="/demo/photos" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center">
              📷 Photo Demo
            </a>
            <a href="/styleguide" className="bg-earth-100 text-earth-800 px-4 py-2 rounded-md hover:bg-earth-200 transition-colors text-center">
              Styleguide
            </a>
          </div>
        </div>

        <div className="bg-primary-100 rounded-lg p-6 max-w-xl mx-auto">
          <p className="text-primary-800 font-medium">
            🚀 Next.js app is running successfully on port 3100!
          </p>
        </div>

        <div className={`rounded-lg p-6 max-w-xl mx-auto ${
          dbStatus === 'connected' ? 'bg-green-100' :
          dbStatus === 'error' ? 'bg-red-100' : 'bg-yellow-100'
        }`}>
          <p className={`font-medium ${
            dbStatus === 'connected' ? 'text-green-800' :
            dbStatus === 'error' ? 'text-red-800' : 'text-yellow-800'
          }`}>
            {dbStatus === 'connecting' && '⏳ Connecting to Supabase database...'}
            {dbStatus === 'connected' && '✅ Supabase database connected successfully!'}
            {dbStatus === 'error' && '❌ Database connection failed. Check your environment variables.'}
          </p>
        </div>
      </div>
    </div>
  );
}