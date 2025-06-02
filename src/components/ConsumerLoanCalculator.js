import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function ConsumerLoanCalculator({ invitationId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isBankConnected, setIsBankConnected] = useState(false);

  // Form setup
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      personalCode: '',
      email: '',
      phone: '',
      consentToTerms: false
    }
  });

  // PRELIVE AccountScoring client ID
  const clientId = '66_vnOJUazTrxsQeliaw80IABUcLbTvGVs4H3XI';

  // AccountScoring container integration (prelive)
  useEffect(() => {
    const scriptSrc = 'https://prelive.accountscoring.com/static/asc-embed-v2.js';
    function loadScript(src, onLoad) {
      if (document.querySelector(`script[src="${src}"]`)) {
        onLoad();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = onLoad;
      document.body.appendChild(script);
    }
    loadScript(scriptSrc, () => {
      function tryInit(retries = 10) {
        if (window.ASCEMBED) {
          window.ASCEMBED.initialize({
            container_id: 'ascContainer',
            invitation_id: invitationId,
            client_id: clientId,
            locale: 'lv_LV',
            is_modal: false,
            onConfirmAllDone: function(status) {
              setIsBankConnected(true);
              setIsSuccess(true);
            },
            onClose: function() {
              setIsBankConnected(false);
            }
          });
        } else if (retries > 0) {
          setTimeout(() => tryInit(retries - 1), 300);
        }
      }
      tryInit();
    });
  }, [invitationId]);

  function onSubmit(data) {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    axios.post('/wp-json/consumer-loan/v1/apply', data)
      .then(() => setIsSuccess(true))
      .catch(() => setError('Kļūda saglabājot datus.'))
      .finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6 text-xl font-semibold">Aizdevuma pieteikums</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Vārds</label>
          <input {...register('firstName', { required: true })} className="w-full border rounded px-3 py-2" />
          {errors.firstName && <span className="text-red-500">Obligāts lauks</span>}
        </div>
        <div>
          <label className="block mb-2">Uzvārds</label>
          <input {...register('lastName', { required: true })} className="w-full border rounded px-3 py-2" />
          {errors.lastName && <span className="text-red-500">Obligāts lauks</span>}
        </div>
        <div>
          <label className="block mb-2">Personas kods</label>
          <input {...register('personalCode', { required: true })} className="w-full border rounded px-3 py-2" />
          {errors.personalCode && <span className="text-red-500">Obligāts lauks</span>}
        </div>
        <div>
          <label className="block mb-2">E-pasts</label>
          <input {...register('email', { required: true })} className="w-full border rounded px-3 py-2" />
          {errors.email && <span className="text-red-500">Obligāts lauks</span>}
        </div>
        <div>
          <label className="block mb-2">Telefons</label>
          <input {...register('phone', { required: true })} className="w-full border rounded px-3 py-2" />
          {errors.phone && <span className="text-red-500">Obligāts lauks</span>}
        </div>
      </div>
      <div className="flex items-center mt-4">
        <input type="checkbox" {...register('consentToTerms', { required: true })} className="mr-2" />
        <span>Piekrītu noteikumiem</span>
        {errors.consentToTerms && <span className="text-red-500 ml-4">Nepieciešama piekrišana</span>}
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {isSuccess && <div className="text-green-600 mt-2">Pieteikums veiksmīgi nosūtīts!</div>}
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded mt-4" disabled={isLoading}>
        {isLoading ? 'Sūta...' : 'Pieteikties'}
      </button>
      <div id="ascContainer" className="mt-6" />
      {isBankConnected && <div className="text-green-600 mt-2">Banka veiksmīgi savienota!</div>}
    </form>
  );
}

export { ConsumerLoanCalculator };