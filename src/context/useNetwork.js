import { useSnackbar } from 'notistack';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { v4 } from 'uuid';
const networkContext = createContext({
  isOnline: true,
});

// const requestSample = {
//   url: 'https://example.com',
//  id: '123',
//   body: JSON.stringify({}),
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   method: 'POST',
// };

const NetworkProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [isOnline, setIsOnline] = useState(true);
  const [queue, setQueue] = useState(() => {
    const queue = localStorage.getItem('queue');
    return queue ? JSON.parse(queue) : [];
  });

  const enqueueRequest = useCallback(
    ({ body, method, headers, url }) => {
      setQueue((prev) => [...prev, { body, method, headers, url, id: v4() }]);

      enqueueSnackbar('Request queued', { variant: 'info' });

      localStorage.setItem('queue', JSON.stringify(queue));
    },
    [enqueueSnackbar, queue]
  );

  const dequeueRequest = useCallback(
    (id) => {
      const newQueue = queue.filter((req) => req.id !== id);
      setQueue(newQueue);
      localStorage.setItem('queue', JSON.stringify(newQueue));
    },
    [queue]
  );

  const sendRequest = useCallback(
    async ({ body, method, headers, url }) => {
      if (!isOnline) {
        enqueueRequest({ body, method, headers, url });
        return;
      }

      try {
        await fetch(url, {
          body,
          method,
          headers,
          mode: 'no-cors',
        });

        enqueueSnackbar('Request sent', { variant: 'success' });
      } catch (error) {
        console.log('error', error);
      }
    },
    [enqueueRequest, enqueueSnackbar, isOnline]
  );

  const syncQueue = useCallback(async () => {
    if (!isOnline) {
      return;
    }

    queue.forEach(async (req) => {
      try {
        await sendRequest(req);
        dequeueRequest(req.id);
      } catch (error) {
        console.log('error', error);
      }
    });
  }, [dequeueRequest, isOnline, queue, sendRequest]);

  useEffect(() => {
    const handleOnline = () => {
      enqueueSnackbar('You are online', { variant: 'success' });
      setIsOnline(true);
    };
    const handleOffline = () => {
      enqueueSnackbar('You are offline', { variant: 'error' });
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (isOnline) {
      syncQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enqueueSnackbar, isOnline, syncQueue]);

  return (
    <networkContext.Provider value={{ isOnline, sendRequest }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          background: isOnline ? 'green' : 'red',
          color: 'white',
          padding: '0.5rem',
          textAlign: 'center',
        }}
      >
        You are {isOnline ? 'online' : 'offline'}.
      </div>
      {children}
    </networkContext.Provider>
  );
};

export { NetworkProvider };

export default networkContext;

export const useNetwork = () => {
  const { isOnline, sendRequest } = useContext(networkContext);

  return { isOnline, sendRequest };
};
