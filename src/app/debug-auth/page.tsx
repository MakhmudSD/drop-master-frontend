'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/hooks/useUser';
import { userVar } from '@/lib/apollo/store';

export default function DebugAuthPage() {
  const authContext = useAuth();
  const userHook = useUser();
  const [localStorageData, setLocalStorageData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocalStorageData({
        jwtToken: localStorage.getItem('jwtToken')?.substring(0, 20) + '...',
        user: localStorage.getItem('user'),
        hasToken: !!localStorage.getItem('jwtToken'),
        hasUser: !!localStorage.getItem('user'),
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🐛 Authentication Debug</h1>
        
        <div className="space-y-6">
          {/* AuthContext State */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">AuthContext (useAuth)</h2>
            <div className="space-y-2 font-mono text-sm">
              <div><strong>Loading:</strong> {JSON.stringify(authContext.loading)}</div>
              <div><strong>User:</strong> {authContext.user ? JSON.stringify({
                _id: authContext.user._id,
                email: authContext.user.email,
                name: authContext.user.name
              }, null, 2) : 'null'}</div>
            </div>
          </div>

          {/* useUser Hook State */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">useUser Hook (Apollo)</h2>
            <div className="space-y-2 font-mono text-sm">
              <div><strong>Is Authenticated:</strong> {JSON.stringify(userHook.isAuthenticated)}</div>
              <div><strong>User:</strong> {userHook.user ? JSON.stringify({
                _id: userHook.user._id,
                email: userHook.user.email,
                name: userHook.user.name
              }, null, 2) : 'null'}</div>
              <div><strong>Cart Count:</strong> {userHook.cartCount}</div>
            </div>
          </div>

          {/* Apollo Reactive Var */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Apollo Reactive Variable</h2>
            <div className="space-y-2 font-mono text-sm">
              <div><strong>userVar():</strong> {userVar() ? JSON.stringify({
                _id: userVar()?._id,
                email: userVar()?.email,
                name: userVar()?.name
              }, null, 2) : 'null'}</div>
            </div>
          </div>

          {/* LocalStorage */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">LocalStorage</h2>
            <div className="space-y-2 font-mono text-sm">
              <div><strong>Has JWT Token:</strong> {JSON.stringify(localStorageData?.hasToken)}</div>
              <div><strong>Token Preview:</strong> {localStorageData?.jwtToken || 'none'}</div>
              <div><strong>Has User:</strong> {JSON.stringify(localStorageData?.hasUser)}</div>
              <div><strong>User Data:</strong> <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-40">{localStorageData?.user || 'none'}</pre></div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  console.log('Current state:', {
                    authContext,
                    userHook,
                    localStorage: localStorageData,
                    userVar: userVar()
                  });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                Log All State to Console
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Clear localStorage & Reload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

