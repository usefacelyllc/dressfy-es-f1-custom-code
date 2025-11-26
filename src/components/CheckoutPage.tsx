import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuiz } from '../context/QuizContext';

interface CheckoutPageProps {
  onBack: () => void;
  selectedPrice: string | null;
  onSuccess: () => void;
}

// Declare Recurly types
declare global {
  interface Window {
    recurly?: any;
    ApplePaySession?: {
      canMakePayments(): boolean;
      new(request: any): any;
    };
  }
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, selectedPrice, onSuccess }) => {
  const { quizData, updateQuizData } = useQuiz();
  const [paymentMethod, setPaymentMethod] = useState<'googlepay' | 'applepay' | 'card'>('card');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  // Detect user's country from timezone
  const detectUserCountry = (): string => {
    try {
      //
      // Try to get country from timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // Map common timezones to countries
      const timezoneToCountry: { [key: string]: string } = {
        'America/Sao_Paulo': 'BR',
        'America/Argentina/Buenos_Aires': 'AR',
        'America/Mexico_City': 'MX',
        'America/New_York': 'US',
        'America/Los_Angeles': 'US',
        'Europe/Madrid': 'ES',
        'America/Bogota': 'CO',
        'America/Santiago': 'CL',
        'America/Lima': 'PE',
      };
      
      if (timezoneToCountry[timezone]) {
        return timezoneToCountry[timezone];
      }
      
      // Fallback: try to get from locale
      const locale = navigator.language || navigator.languages?.[0] || 'en-US';
      const countryCode = locale.split('-')[1]?.toUpperCase();
      if (countryCode && countryCode.length === 2) {
        return countryCode;
      }
    } catch (e) {
      console.error('Error detecting country:', e);
    }
    return 'BR'; // Default fallback
  };

  const [country, setCountry] = useState<string>(detectUserCountry());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recurlyLoaded, setRecurlyLoaded] = useState(false);
  const [applePayAvailable, setApplePayAvailable] = useState(false);
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);
  
  // Recurly elements refs
  const cardNumberRef = useRef<HTMLDivElement>(null);
  const cardMonthRef = useRef<HTMLDivElement>(null);
  const cardYearRef = useRef<HTMLDivElement>(null);
  const cardCvvRef = useRef<HTMLDivElement>(null);
  const recurlyInstanceRef = useRef<any>(null);
  const cardNumberElementRef = useRef<any>(null);
  const cardMonthElementRef = useRef<any>(null);
  const cardYearElementRef = useRef<any>(null);
  const cardCvvElementRef = useRef<any>(null);
  const applePayButtonRef = useRef<HTMLDivElement>(null);
  const googlePayButtonRef = useRef<HTMLDivElement>(null);
  const applePayInstanceRef = useRef<any>(null);
  const googlePayInstanceRef = useRef<any>(null);

  // Initialize data from context - watch for changes
  useEffect(() => {
    // Initialize email
    if (quizData.email) {
      setEmail(quizData.email);
    }

    // Initialize name: split first word as first name, rest as last name
    if (quizData.name) {
      const nameParts = quizData.name.trim().split(/\s+/);
      setFirstName(nameParts[0] || '');
      if (nameParts.length > 1) {
        setLastName(nameParts.slice(1).join(' '));
      } else {
        // If only one word, keep it as first name and leave last name empty
        setLastName('');
      }
    }
  }, [quizData.name, quizData.email]); // Watch for changes in quizData

  // Clear error when payment method changes
  useEffect(() => {
    setError(null);
  }, [paymentMethod]);

  // Load Recurly.js script - check if already loaded
  useEffect(() => {
    const publicKey = import.meta.env.VITE_RECURLY_PUBLIC_KEY;
    
    if (!publicKey) {
      setError('Recurly public key not configured. Please check your .env file.');
      console.error('VITE_RECURLY_PUBLIC_KEY is not set');
      return;
    }

    console.log('Recurly public key found:', publicKey.substring(0, 10) + '...');

    // Check if Recurly is already loaded
    if (window.recurly) {
      console.log('Recurly already loaded, initializing...');
      try {
        // Recurly.js v4 uses configure method
        if (window.recurly.configure) {
          window.recurly.configure(publicKey);
          recurlyInstanceRef.current = window.recurly;
          setRecurlyLoaded(true);
          setError(null);
          console.log('Recurly initialized successfully');
        } else {
          throw new Error('Recurly.configure is not available');
        }
      } catch (err: any) {
        console.error('Error initializing Recurly:', err);
        console.error('Recurly object:', window.recurly);
        setError(`Error initializing payment system: ${err?.message || 'Unknown error'}`);
      }
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://js.recurly.com/v4/recurly.js"]');
    if (existingScript) {
      console.log('Recurly script already exists, waiting for load...');
      // Check if already loaded
      if (window.recurly && window.recurly.configure) {
        try {
          window.recurly.configure(publicKey);
          recurlyInstanceRef.current = window.recurly;
          setRecurlyLoaded(true);
          setError(null);
          console.log('Recurly initialized from existing script');
        } catch (err: any) {
          console.error('Error initializing Recurly:', err);
          setError(`Error initializing payment system: ${err?.message || 'Unknown error'}`);
        }
      } else {
        // Wait for it to load
        existingScript.addEventListener('load', () => {
          console.log('Existing Recurly script loaded');
          if (window.recurly && window.recurly.configure) {
            try {
              window.recurly.configure(publicKey);
              recurlyInstanceRef.current = window.recurly;
              setRecurlyLoaded(true);
              setError(null);
              console.log('Recurly initialized successfully');
            } catch (err: any) {
              console.error('Error initializing Recurly:', err);
              setError(`Error initializing payment system: ${err?.message || 'Unknown error'}`);
            }
          }
        });
      }
      return;
    }

    // Create and load script
    console.log('Loading Recurly.js script...');
    const script = document.createElement('script');
    script.src = 'https://js.recurly.com/v4/recurly.js';
    script.async = true;
    script.onload = () => {
      console.log('Recurly.js script loaded successfully');
      if (window.recurly && window.recurly.configure) {
        try {
          window.recurly.configure(publicKey);
          recurlyInstanceRef.current = window.recurly;
          setRecurlyLoaded(true);
          setError(null);
          console.log('Recurly initialized successfully');
        } catch (err: any) {
          console.error('Error initializing Recurly:', err);
          setError(`Error initializing payment system: ${err?.message || 'Unknown error'}`);
        }
      } else {
        console.error('window.recurly or window.recurly.configure is not available after script load');
        console.error('window.recurly:', window.recurly);
        setError('Recurly library failed to load properly');
      }
    };
    script.onerror = (err) => {
      console.error('Failed to load Recurly.js script:', err);
      setError('Failed to load payment system. Please check your internet connection.');
    };
    document.head.appendChild(script);
  }, []);

  // Initialize Recurly Elements when Recurly is loaded and payment method is card
  useEffect(() => {
    if (!recurlyLoaded || !recurlyInstanceRef.current || paymentMethod !== 'card') {
      // Destroy elements if switching away from card payment
      if (paymentMethod !== 'card') {
        try {
          if (cardNumberElementRef.current) cardNumberElementRef.current.destroy?.();
          if (cardMonthElementRef.current) cardMonthElementRef.current.destroy?.();
          if (cardYearElementRef.current) cardYearElementRef.current.destroy?.();
          if (cardCvvElementRef.current) cardCvvElementRef.current.destroy?.();
        } catch (e) {
          // Ignore
        }
      }
      return;
    }

    // Wait a bit for DOM to be ready - use requestAnimationFrame for better timing
    const mountElements = () => {
      console.log('Checking refs:', {
        cardNumber: !!cardNumberRef.current,
        cardMonth: !!cardMonthRef.current,
        cardYear: !!cardYearRef.current,
        cardCvv: !!cardCvvRef.current
      });
      
      if (cardNumberRef.current && cardMonthRef.current && cardYearRef.current && cardCvvRef.current) {
        try {
          // Get Recurly instance - Recurly.js v4 API
          // According to docs: recurly.Elements() must be called as a function to get an instance
          const recurly = recurlyInstanceRef.current;
          if (!recurly || typeof recurly.Elements !== 'function') {
            throw new Error('Recurly.Elements is not available or is not a function');
          }

          // Call Elements() as a function to get an instance (Recurly.js v4 API)
          const elements = recurly.Elements();
          const style = {
            fontFamily: '"Sen", sans-serif',
            fontSize: '14px',
            color: '#000000',
            padding: '8px 12px',
            lineHeight: '1.5',
            placeholder: {
              color: '#9CA3AF',
            },
            invalid: {
              color: '#EF4444',
            },
          };

          // Destroy existing elements if they exist
          if (cardNumberElementRef.current) {
            try {
              cardNumberElementRef.current.destroy();
            } catch (e) {
              // Ignore destroy errors
            }
          }
          if (cardMonthElementRef.current) {
            try {
              cardMonthElementRef.current.destroy();
            } catch (e) {
              // Ignore destroy errors
            }
          }
          if (cardYearElementRef.current) {
            try {
              cardYearElementRef.current.destroy();
            } catch (e) {
              // Ignore destroy errors
            }
          }
          if (cardCvvElementRef.current) {
            try {
              cardCvvElementRef.current.destroy();
            } catch (e) {
              // Ignore destroy errors
            }
          }

          // Use the correct Recurly.js v4 API - create elements and then attach them
          // Based on the working example: create element first, then call .attach()
          try {
            // Verify elements exist in DOM
            const numberEl = document.getElementById('recurly-card-number');
            const monthEl = document.getElementById('recurly-card-month');
            const yearEl = document.getElementById('recurly-card-year');
            const cvvEl = document.getElementById('recurly-card-cvv');
            
            console.log('DOM elements found:', { numberEl, monthEl, yearEl, cvvEl });

            if (!numberEl || !monthEl || !yearEl || !cvvEl) {
              throw new Error('One or more DOM elements not found');
            }

            // Create elements WITHOUT selector (as in the working example)
            // Use elements instance to create card elements (Recurly.js v4 API)
            cardNumberElementRef.current = elements.CardNumberElement({
              style: style,
              displayIcon: false,
            });
            // Attach to DOM element using selector string
            cardNumberElementRef.current.attach('#recurly-card-number');
            console.log('CardNumberElement created and attached');

            cardMonthElementRef.current = elements.CardMonthElement({
              style: style,
            });
            cardMonthElementRef.current.attach('#recurly-card-month');
            console.log('CardMonthElement created and attached');

            cardYearElementRef.current = elements.CardYearElement({
              style: style,
            });
            cardYearElementRef.current.attach('#recurly-card-year');
            console.log('CardYearElement created and attached');

            cardCvvElementRef.current = elements.CardCvvElement({
              style: style,
            });
            cardCvvElementRef.current.attach('#recurly-card-cvv');
            console.log('CardCvvElement created and attached');

            // Apply custom styles to Recurly iframes/inputs after mount
            setTimeout(() => {
              const numberInputs = numberEl.querySelectorAll('input, iframe, [data-recurly]');
              const monthInputs = monthEl.querySelectorAll('input, iframe, [data-recurly]');
              const yearInputs = yearEl.querySelectorAll('input, iframe, [data-recurly]');
              const cvvInputs = cvvEl.querySelectorAll('input, iframe, [data-recurly]');
              
              // Apply styles to all Recurly elements
              [numberInputs, monthInputs, yearInputs, cvvInputs].forEach(inputs => {
                inputs.forEach((el: any) => {
                  if (el.tagName === 'IFRAME') {
                    el.style.height = '40px';
                    el.style.border = 'none';
                    el.style.width = '100%';
                  } else if (el.tagName === 'INPUT') {
                    el.style.height = '40px';
                    el.style.border = 'none';
                    el.style.padding = '8px 12px';
                  }
                });
              });

              // Apply styles to parent containers - keep border from CSS, just set padding
              [numberEl, monthEl, yearEl, cvvEl].forEach(el => {
                if (el) {
                  el.style.padding = '0';
                  // Don't remove border - let CSS handle it
                }
              });
              
              console.log('Mounted elements check:', {
                numberInputs: numberInputs.length,
                monthInputs: monthInputs.length,
                yearInputs: yearInputs.length,
                cvvInputs: cvvInputs.length,
              });
            }, 500);
          } catch (elementErr: any) {
            console.error('Error creating individual element:', elementErr);
            throw elementErr;
          }
          
          console.log('All Recurly elements created successfully');
        } catch (err) {
          console.error('Error creating Recurly elements:', err);
          setError('Error initializing payment fields');
        }
      } else {
        console.warn('Some refs are not ready yet, retrying...');
        // Retry after a short delay
        setTimeout(mountElements, 100);
      }
    };

    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      setTimeout(mountElements, 100);
    });

    return () => {
      // Cleanup on unmount
      try {
        if (cardNumberElementRef.current) cardNumberElementRef.current.destroy?.();
        if (cardMonthElementRef.current) cardMonthElementRef.current.destroy?.();
        if (cardYearElementRef.current) cardYearElementRef.current.destroy?.();
        if (cardCvvElementRef.current) cardCvvElementRef.current.destroy?.();
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, [recurlyLoaded, paymentMethod]);

  // Helper function to process payment tokens (used by both Apple Pay and Google Pay)
  const processPaymentToken = useCallback((token: any, method: 'applepay' | 'googlepay') => {
    if (token && token.id) {
      // Extract numeric value from price string (e.g., "$5.00" -> 5.00)
      const priceString = selectedPrice || quizData.selectedPrice || '$0.00';
      const trialAmountNumber = parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;
      
      // Prepare payload for backend API
      const payload = {
        tokenId: token.id,
        customerEmail: email.trim(),
        customerName: `${firstName.trim()} ${lastName.trim()}`,
        trialAmount: trialAmountNumber,
        trialDays: 7, // Fixed 7 days trial
      };

      // POST to backend API
      fetch('https://backend-hub-api-ten.vercel.app/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Error del servidor' }));
            throw new Error(errorData.error || 'Error al procesar el pago');
          }
          return res.json();
        })
        .then((data) => {
          // Save to context
          updateQuizData({ 
            selectedPrice: selectedPrice || quizData.selectedPrice,
            name: `${firstName.trim()} ${lastName.trim()}`,
            email: email.trim()
          });
          // Call success callback
          onSuccess();
        })
        .catch((err) => {
          console.error('Checkout error:', err);
          setError(err.message || 'Error al procesar el pago');
          setIsLoading(false);
        });
    } else {
      setError('No se pudo generar el token de pago');
      setIsLoading(false);
    }
  }, [selectedPrice, quizData.selectedPrice, email, firstName, lastName, updateQuizData, onSuccess]);

  // Check availability of Apple Pay and Google Pay
  useEffect(() => {
    if (!recurlyLoaded || !recurlyInstanceRef.current) {
      return;
    }

    const recurly = recurlyInstanceRef.current;
    
    // Check Apple Pay availability
    if (recurly.ApplePay && typeof recurly.ApplePay === 'function') {
      try {
        const priceString = selectedPrice || quizData.selectedPrice || '$0.00';
        const amount = parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;
        
        // Check if Apple Pay is available on this device/browser
        if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
          setApplePayAvailable(true);
        } else {
          setApplePayAvailable(false);
        }
      } catch (err) {
        console.log('Apple Pay not available:', err);
        setApplePayAvailable(false);
      }
    } else {
      setApplePayAvailable(false);
    }

    // Check Google Pay availability
    if (recurly.GooglePay && typeof recurly.GooglePay === 'function') {
      try {
        // Log the GooglePay function to understand its structure
        console.log('GooglePay function found:', recurly.GooglePay);
        // Google Pay is generally available if the API exists
        // The actual availability will be checked when initializing the button
        setGooglePayAvailable(true);
      } catch (err) {
        console.log('Google Pay not available:', err);
        setGooglePayAvailable(false);
      }
    } else {
      console.log('GooglePay not found in recurly object. Available methods:', Object.keys(recurly));
      setGooglePayAvailable(false);
    }
  }, [recurlyLoaded, selectedPrice, quizData.selectedPrice]);

  // Initialize Apple Pay button
  useEffect(() => {
    if (!recurlyLoaded || !recurlyInstanceRef.current || paymentMethod !== 'applepay' || !applePayAvailable) {
      return;
    }

    if (!applePayButtonRef.current) {
      return;
    }

    const recurly = recurlyInstanceRef.current;
    const priceString = selectedPrice || quizData.selectedPrice || '$0.00';
    const amount = parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;

    try {
      // Create Apple Pay instance
      // According to Recurly docs, ApplePay configuration
      const applePay = recurly.ApplePay({
        country: country,
        currency: 'USD',
        total: amount.toString(),
        label: 'Dressfy Subscription',
      });

      applePayInstanceRef.current = applePay;

      // Handle ready event FIRST - the button can only be attached when ready
      applePay.on('ready', () => {
        console.log('Apple Pay ready - attempting to attach button');
        
        // Now try to attach the button
        if (applePayButtonRef.current && applePayButtonRef.current.id) {
          const selector = `#${applePayButtonRef.current.id}`;
          console.log('Attempting to attach ApplePay to:', selector);
          
          if (typeof applePay.attach === 'function') {
            applePay.attach(selector);
            console.log('ApplePay attached successfully');
          } else if (typeof applePay.mount === 'function') {
            applePay.mount(selector);
            console.log('ApplePay mounted successfully');
          } else if (typeof applePay.render === 'function') {
            applePay.render(selector);
            console.log('ApplePay rendered successfully');
          } else {
            console.warn('No attach/mount/render method found for ApplePay');
            console.log('ApplePay object:', applePay);
            setError('Apple Pay está disponível, mas há um problema na inicialização. Tente novamente ou use outro método.');
          }
        }
      });

      // Handle token event
      applePay.on('token', (token: any) => {
        console.log('Apple Pay token received:', token);
        setIsLoading(true);
        processPaymentToken(token, 'applepay');
      });

      // Handle error event
      applePay.on('error', (err: any) => {
        console.error('Apple Pay error:', err);
        setError(err.message || 'Error con Apple Pay');
        setIsLoading(false);
      });

      // Also check if ApplePay becomes unavailable
      applePay.on('unavailable', () => {
        console.log('Apple Pay is unavailable on this device/browser');
        setApplePayAvailable(false);
        setError('Apple Pay não está disponível neste dispositivo ou navegador.');
      });

    } catch (err: any) {
      console.error('Error initializing Apple Pay:', err);
      setError(`Error inicializando Apple Pay: ${err?.message || 'Unknown error'}`);
    }

    return () => {
      if (applePayInstanceRef.current) {
        try {
          applePayInstanceRef.current.destroy?.();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [recurlyLoaded, paymentMethod, applePayAvailable, country, selectedPrice, quizData.selectedPrice, processPaymentToken]);

  // Initialize Google Pay button
  useEffect(() => {
    if (!recurlyLoaded || !recurlyInstanceRef.current || paymentMethod !== 'googlepay' || !googlePayAvailable) {
      return;
    }

    if (!googlePayButtonRef.current) {
      return;
    }

    const recurly = recurlyInstanceRef.current;
    const priceString = selectedPrice || quizData.selectedPrice || '$0.00';
    const amount = parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;

    try {
      // Create Google Pay instance
      // Log to understand the API structure
      console.log('Creating GooglePay with config:', { country, currency: 'USD', total: amount.toString() });
      const googlePay = recurly.GooglePay({
        country: country,
        currency: 'USD',
        total: amount.toString(),
      });

      console.log('GooglePay instance created:', googlePay);
      console.log('GooglePay methods:', Object.keys(googlePay));
      
      googlePayInstanceRef.current = googlePay;

      // Handle ready event FIRST - the button can only be attached when ready
      googlePay.on('ready', () => {
        console.log('Google Pay ready - attempting to attach button');
        
        // Now try to attach the button
        if (googlePayButtonRef.current && googlePayButtonRef.current.id) {
          const selector = `#${googlePayButtonRef.current.id}`;
          console.log('Attempting to attach GooglePay to:', selector);
          
          // Check if there's a method to attach/render
          // The API might be different - check for common patterns
          if (typeof googlePay.attach === 'function') {
            googlePay.attach(selector);
            console.log('GooglePay attached successfully');
          } else if (typeof googlePay.mount === 'function') {
            googlePay.mount(selector);
            console.log('GooglePay mounted successfully');
          } else if (typeof googlePay.render === 'function') {
            googlePay.render(selector);
            console.log('GooglePay rendered successfully');
          } else if (googlePay.recurly && typeof googlePay.recurly === 'object') {
            // Maybe it's through the recurly instance
            console.log('Checking recurly instance for attach method');
            const recurlyInstance = googlePay.recurly;
            if (typeof recurlyInstance.attach === 'function') {
              recurlyInstance.attach(selector);
            } else {
              console.warn('No attach method found in recurly instance');
              // Try to manually create button or use alternative approach
              setError('Google Pay está disponível, mas há um problema na inicialização. Tente novamente ou use outro método.');
            }
          } else {
            console.warn('No attach/mount/render method found. GooglePay might work differently.');
            // Some APIs auto-render when ready - check if button appears automatically
            console.log('Waiting to see if GooglePay renders automatically...');
          }
        }
      });

      // Handle token event
      googlePay.on('token', (token: any) => {
        console.log('Google Pay token received:', token);
        setIsLoading(true);
        processPaymentToken(token, 'googlepay');
      });

      // Handle error event
      googlePay.on('error', (err: any) => {
        console.error('Google Pay error:', err);
        setError(err.message || 'Error con Google Pay');
        setIsLoading(false);
      });

      // Also check if GooglePay becomes unavailable
      googlePay.on('unavailable', () => {
        console.log('Google Pay is unavailable on this device/browser');
        setGooglePayAvailable(false);
        setError('Google Pay não está disponível neste dispositivo ou navegador.');
      });

    } catch (err: any) {
      console.error('Error initializing Google Pay:', err);
      setError(`Error inicializando Google Pay: ${err?.message || 'Unknown error'}`);
    }

    return () => {
      if (googlePayInstanceRef.current) {
        try {
          googlePayInstanceRef.current.destroy?.();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [recurlyLoaded, paymentMethod, googlePayAvailable, country, selectedPrice, quizData.selectedPrice, processPaymentToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!firstName.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!lastName.trim()) {
      setError('El apellido es obligatorio');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('El correo electrónico es obligatorio y debe ser válido');
      return;
    }

    if (paymentMethod === 'card') {
      if (!recurlyInstanceRef.current) {
        setError('Sistema de pago no inicializado');
        return;
      }

      setIsLoading(true);

      try {
        // Tokenize the payment - Recurly.js v4 API
        // Based on working example: use recurly.token(form, callback)
        // The form element contains data-recurly attributes and the elements
        const form = document.getElementById('checkout-form') as HTMLFormElement;
        if (!form) {
          throw new Error('Form element not found');
        }

        // Update hidden inputs with billing info (already in the form via JSX)
        const firstNameInput = form.querySelector('[data-recurly="first_name"]') as HTMLInputElement;
        const lastNameInput = form.querySelector('[data-recurly="last_name"]') as HTMLInputElement;
        
        if (firstNameInput) {
          firstNameInput.value = firstName.trim();
        }
        if (lastNameInput) {
          lastNameInput.value = lastName.trim();
        }

        // Use recurly.token(form, callback) as in the working example
        recurlyInstanceRef.current.token(form, (err: any, token: any) => {
          if (err) {
            setError(err.message || 'Error al procesar el pago');
            setIsLoading(false);
            return;
          }

          if (token && token.id) {
            // Extract numeric value from price string (e.g., "$5.00" -> 5.00)
            const priceString = selectedPrice || quizData.selectedPrice || '$0.00';
            const trialAmountNumber = parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;
            
            // Prepare payload for backend API
            // Backend expects trialAmount as a NUMBER (not string) to create line_item
            const payload = {
              tokenId: token.id,
              customerEmail: email.trim(),
              customerName: `${firstName.trim()} ${lastName.trim()}`,
              trialAmount: trialAmountNumber, // IMPORTANT: Number, not string - activates line_item in backend
              trialDays: 7, // Fixed 7 days trial
            };

            // POST to backend API
            fetch('https://backend-hub-api-ten.vercel.app/api/checkout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            })
              .then(async (res) => {
                if (!res.ok) {
                  const errorData = await res.json().catch(() => ({ error: 'Error del servidor' }));
                  throw new Error(errorData.error || 'Error al procesar el pago');
                }
                return res.json();
              })
              .then((data) => {
                // Save to context
                updateQuizData({ 
                  selectedPrice: selectedPrice || quizData.selectedPrice,
                  name: `${firstName.trim()} ${lastName.trim()}`,
                  email: email.trim()
                });
                // Call success callback
                onSuccess();
              })
              .catch((err) => {
                console.error('Checkout error:', err);
                setError(err.message || 'Error al procesar el pago');
                setIsLoading(false);
              });
          } else {
            setError('No se pudo generar el token de pago');
            setIsLoading(false);
          }
        });
      } catch (err: any) {
        console.error('Tokenization error:', err);
        setError(err.message || 'Error al procesar el pago');
        setIsLoading(false);
      }
    } else if (paymentMethod === 'googlepay') {
      // Google Pay payment - handled by button click event
      if (!googlePayInstanceRef.current) {
        setError('Google Pay no está disponible en este dispositivo');
        return;
      }
      setIsLoading(true);
      setError(null);
      // The actual payment is triggered by the Google Pay button
      // The token event handler will process the payment
    } else if (paymentMethod === 'applepay') {
      // Apple Pay payment - handled by button click event
      if (!applePayInstanceRef.current) {
        setError('Apple Pay no está disponible en este dispositivo');
        return;
      }
      setIsLoading(true);
      setError(null);
      // The actual payment is triggered by the Apple Pay button
      // The token event handler will process the payment
    }
  };

  // Comprehensive list of countries, sorted alphabetically
  const countries = [
    { value: 'AD', label: 'Andorra' },
    { value: 'AE', label: 'Emiratos Árabes Unidos' },
    { value: 'AF', label: 'Afganistán' },
    { value: 'AG', label: 'Antigua y Barbuda' },
    { value: 'AI', label: 'Anguila' },
    { value: 'AL', label: 'Albania' },
    { value: 'AM', label: 'Armenia' },
    { value: 'AR', label: 'Argentina' },
    { value: 'AS', label: 'Samoa Americana' },
    { value: 'AT', label: 'Austria' },
    { value: 'AU', label: 'Australia' },
    { value: 'AW', label: 'Aruba' },
    { value: 'AZ', label: 'Azerbaiyán' },
    { value: 'BA', label: 'Bosnia y Herzegovina' },
    { value: 'BB', label: 'Barbados' },
    { value: 'BD', label: 'Bangladesh' },
    { value: 'BE', label: 'Bélgica' },
    { value: 'BF', label: 'Burkina Faso' },
    { value: 'BG', label: 'Bulgaria' },
    { value: 'BH', label: 'Baréin' },
    { value: 'BI', label: 'Burundi' },
    { value: 'BJ', label: 'Benín' },
    { value: 'BL', label: 'San Bartolomé' },
    { value: 'BM', label: 'Bermudas' },
    { value: 'BN', label: 'Brunéi' },
    { value: 'BO', label: 'Bolivia' },
    { value: 'BQ', label: 'Caribe Neerlandés' },
    { value: 'BR', label: 'Brasil' },
    { value: 'BS', label: 'Bahamas' },
    { value: 'BT', label: 'Bután' },
    { value: 'BW', label: 'Botsuana' },
    { value: 'BY', label: 'Bielorrusia' },
    { value: 'BZ', label: 'Belice' },
    { value: 'CA', label: 'Canadá' },
    { value: 'CC', label: 'Islas Cocos' },
    { value: 'CD', label: 'República Democrática del Congo' },
    { value: 'CF', label: 'República Centroafricana' },
    { value: 'CG', label: 'Congo' },
    { value: 'CH', label: 'Suiza' },
    { value: 'CI', label: 'Costa de Marfil' },
    { value: 'CK', label: 'Islas Cook' },
    { value: 'CL', label: 'Chile' },
    { value: 'CM', label: 'Camerún' },
    { value: 'CN', label: 'China' },
    { value: 'CO', label: 'Colombia' },
    { value: 'CR', label: 'Costa Rica' },
    { value: 'CU', label: 'Cuba' },
    { value: 'CV', label: 'Cabo Verde' },
    { value: 'CW', label: 'Curazao' },
    { value: 'CX', label: 'Isla de Navidad' },
    { value: 'CY', label: 'Chipre' },
    { value: 'CZ', label: 'República Checa' },
    { value: 'DE', label: 'Alemania' },
    { value: 'DJ', label: 'Yibuti' },
    { value: 'DK', label: 'Dinamarca' },
    { value: 'DM', label: 'Dominica' },
    { value: 'DO', label: 'República Dominicana' },
    { value: 'DZ', label: 'Argelia' },
    { value: 'EC', label: 'Ecuador' },
    { value: 'EE', label: 'Estonia' },
    { value: 'EG', label: 'Egipto' },
    { value: 'EH', label: 'Sahara Occidental' },
    { value: 'ER', label: 'Eritrea' },
    { value: 'ES', label: 'España' },
    { value: 'ET', label: 'Etiopía' },
    { value: 'FI', label: 'Finlandia' },
    { value: 'FJ', label: 'Fiyi' },
    { value: 'FK', label: 'Islas Malvinas' },
    { value: 'FM', label: 'Micronesia' },
    { value: 'FO', label: 'Islas Feroe' },
    { value: 'FR', label: 'Francia' },
    { value: 'GA', label: 'Gabón' },
    { value: 'GB', label: 'Reino Unido' },
    { value: 'GD', label: 'Granada' },
    { value: 'GE', label: 'Georgia' },
    { value: 'GF', label: 'Guayana Francesa' },
    { value: 'GG', label: 'Guernsey' },
    { value: 'GH', label: 'Ghana' },
    { value: 'GI', label: 'Gibraltar' },
    { value: 'GL', label: 'Groenlandia' },
    { value: 'GM', label: 'Gambia' },
    { value: 'GN', label: 'Guinea' },
    { value: 'GP', label: 'Guadalupe' },
    { value: 'GQ', label: 'Guinea Ecuatorial' },
    { value: 'GR', label: 'Grecia' },
    { value: 'GS', label: 'Georgia del Sur e Islas Sandwich del Sur' },
    { value: 'GT', label: 'Guatemala' },
    { value: 'GU', label: 'Guam' },
    { value: 'GW', label: 'Guinea-Bisáu' },
    { value: 'GY', label: 'Guyana' },
    { value: 'HK', label: 'Hong Kong' },
    { value: 'HN', label: 'Honduras' },
    { value: 'HR', label: 'Croacia' },
    { value: 'HT', label: 'Haití' },
    { value: 'HU', label: 'Hungría' },
    { value: 'ID', label: 'Indonesia' },
    { value: 'IE', label: 'Irlanda' },
    { value: 'IL', label: 'Israel' },
    { value: 'IM', label: 'Isla de Man' },
    { value: 'IN', label: 'India' },
    { value: 'IO', label: 'Territorio Británico del Océano Índico' },
    { value: 'IQ', label: 'Irak' },
    { value: 'IR', label: 'Irán' },
    { value: 'IS', label: 'Islandia' },
    { value: 'IT', label: 'Italia' },
    { value: 'JE', label: 'Jersey' },
    { value: 'JM', label: 'Jamaica' },
    { value: 'JO', label: 'Jordania' },
    { value: 'JP', label: 'Japón' },
    { value: 'KE', label: 'Kenia' },
    { value: 'KG', label: 'Kirguistán' },
    { value: 'KH', label: 'Camboya' },
    { value: 'KI', label: 'Kiribati' },
    { value: 'KM', label: 'Comoras' },
    { value: 'KN', label: 'San Cristóbal y Nieves' },
    { value: 'KP', label: 'Corea del Norte' },
    { value: 'KR', label: 'Corea del Sur' },
    { value: 'KW', label: 'Kuwait' },
    { value: 'KY', label: 'Islas Caimán' },
    { value: 'KZ', label: 'Kazajistán' },
    { value: 'LA', label: 'Laos' },
    { value: 'LB', label: 'Líbano' },
    { value: 'LC', label: 'Santa Lucía' },
    { value: 'LI', label: 'Liechtenstein' },
    { value: 'LK', label: 'Sri Lanka' },
    { value: 'LR', label: 'Liberia' },
    { value: 'LS', label: 'Lesoto' },
    { value: 'LT', label: 'Lituania' },
    { value: 'LU', label: 'Luxemburgo' },
    { value: 'LV', label: 'Letonia' },
    { value: 'LY', label: 'Libia' },
    { value: 'MA', label: 'Marruecos' },
    { value: 'MC', label: 'Mónaco' },
    { value: 'MD', label: 'Moldavia' },
    { value: 'ME', label: 'Montenegro' },
    { value: 'MF', label: 'San Martín' },
    { value: 'MG', label: 'Madagascar' },
    { value: 'MH', label: 'Islas Marshall' },
    { value: 'MK', label: 'Macedonia del Norte' },
    { value: 'ML', label: 'Malí' },
    { value: 'MM', label: 'Myanmar' },
    { value: 'MN', label: 'Mongolia' },
    { value: 'MO', label: 'Macao' },
    { value: 'MP', label: 'Islas Marianas del Norte' },
    { value: 'MQ', label: 'Martinica' },
    { value: 'MR', label: 'Mauritania' },
    { value: 'MS', label: 'Montserrat' },
    { value: 'MT', label: 'Malta' },
    { value: 'MU', label: 'Mauricio' },
    { value: 'MV', label: 'Maldivas' },
    { value: 'MW', label: 'Malaui' },
    { value: 'MX', label: 'México' },
    { value: 'MY', label: 'Malasia' },
    { value: 'MZ', label: 'Mozambique' },
    { value: 'NA', label: 'Namibia' },
    { value: 'NC', label: 'Nueva Caledonia' },
    { value: 'NE', label: 'Níger' },
    { value: 'NF', label: 'Isla Norfolk' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'NI', label: 'Nicaragua' },
    { value: 'NL', label: 'Países Bajos' },
    { value: 'NO', label: 'Noruega' },
    { value: 'NP', label: 'Nepal' },
    { value: 'NR', label: 'Nauru' },
    { value: 'NU', label: 'Niue' },
    { value: 'NZ', label: 'Nueva Zelanda' },
    { value: 'OM', label: 'Omán' },
    { value: 'PA', label: 'Panamá' },
    { value: 'PE', label: 'Perú' },
    { value: 'PF', label: 'Polinesia Francesa' },
    { value: 'PG', label: 'Papúa Nueva Guinea' },
    { value: 'PH', label: 'Filipinas' },
    { value: 'PK', label: 'Pakistán' },
    { value: 'PL', label: 'Polonia' },
    { value: 'PM', label: 'San Pedro y Miquelón' },
    { value: 'PN', label: 'Islas Pitcairn' },
    { value: 'PR', label: 'Puerto Rico' },
    { value: 'PS', label: 'Palestina' },
    { value: 'PT', label: 'Portugal' },
    { value: 'PW', label: 'Palaos' },
    { value: 'PY', label: 'Paraguay' },
    { value: 'QA', label: 'Catar' },
    { value: 'RE', label: 'Reunión' },
    { value: 'RO', label: 'Rumania' },
    { value: 'RS', label: 'Serbia' },
    { value: 'RU', label: 'Rusia' },
    { value: 'RW', label: 'Ruanda' },
    { value: 'SA', label: 'Arabia Saudí' },
    { value: 'SB', label: 'Islas Salomón' },
    { value: 'SC', label: 'Seychelles' },
    { value: 'SD', label: 'Sudán' },
    { value: 'SE', label: 'Suecia' },
    { value: 'SG', label: 'Singapur' },
    { value: 'SH', label: 'Santa Elena' },
    { value: 'SI', label: 'Eslovenia' },
    { value: 'SJ', label: 'Svalbard y Jan Mayen' },
    { value: 'SK', label: 'Eslovaquia' },
    { value: 'SL', label: 'Sierra Leona' },
    { value: 'SM', label: 'San Marino' },
    { value: 'SN', label: 'Senegal' },
    { value: 'SO', label: 'Somalia' },
    { value: 'SR', label: 'Surinam' },
    { value: 'SS', label: 'Sudán del Sur' },
    { value: 'ST', label: 'Santo Tomé y Príncipe' },
    { value: 'SV', label: 'El Salvador' },
    { value: 'SX', label: 'Sint Maarten' },
    { value: 'SY', label: 'Siria' },
    { value: 'SZ', label: 'Esuatini' },
    { value: 'TC', label: 'Islas Turcas y Caicos' },
    { value: 'TD', label: 'Chad' },
    { value: 'TF', label: 'Territorios Australes Franceses' },
    { value: 'TG', label: 'Togo' },
    { value: 'TH', label: 'Tailandia' },
    { value: 'TJ', label: 'Tayikistán' },
    { value: 'TK', label: 'Tokelau' },
    { value: 'TL', label: 'Timor Oriental' },
    { value: 'TM', label: 'Turkmenistán' },
    { value: 'TN', label: 'Túnez' },
    { value: 'TO', label: 'Tonga' },
    { value: 'TR', label: 'Turquía' },
    { value: 'TT', label: 'Trinidad y Tobago' },
    { value: 'TV', label: 'Tuvalu' },
    { value: 'TW', label: 'Taiwán' },
    { value: 'TZ', label: 'Tanzania' },
    { value: 'UA', label: 'Ucrania' },
    { value: 'UG', label: 'Uganda' },
    { value: 'UM', label: 'Islas Ultramarinas de Estados Unidos' },
    { value: 'US', label: 'Estados Unidos' },
    { value: 'UY', label: 'Uruguay' },
    { value: 'UZ', label: 'Uzbekistán' },
    { value: 'VA', label: 'Ciudad del Vaticano' },
    { value: 'VC', label: 'San Vicente y las Granadinas' },
    { value: 'VE', label: 'Venezuela' },
    { value: 'VG', label: 'Islas Vírgenes Británicas' },
    { value: 'VI', label: 'Islas Vírgenes de EE.UU.' },
    { value: 'VN', label: 'Vietnam' },
    { value: 'VU', label: 'Vanuatu' },
    { value: 'WF', label: 'Wallis y Futuna' },
    { value: 'WS', label: 'Samoa' },
    { value: 'XK', label: 'Kosovo' },
    { value: 'YE', label: 'Yemen' },
    { value: 'YT', label: 'Mayotte' },
    { value: 'ZA', label: 'Sudáfrica' },
    { value: 'ZM', label: 'Zambia' },
    { value: 'ZW', label: 'Zimbabue' },
  ];

  return (
    <div className="bg-complementar text-apoio min-h-screen font-sen pb-32">
      <div className="max-w-sm mx-auto py-6 px-4">
        <header className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack} 
            className="text-3xl p-2 -ml-2 hover:opacity-75 transition-opacity focus:outline-none" 
            aria-label="Voltar"
          >
            &lt;
          </button>
          <img 
            src="/assets/logo-dressfy.webp" 
            alt="Dressfy Logo"
            className="h-6"
          />
          <div className="w-8"></div>
        </header>

        {/* Main Checkout Card */}
        <div className="bg-white rounded-2xl shadow-lg max-w-[480px] mx-auto p-6">
          <h1 className="font-playfair text-2xl font-bold mb-6 text-center">
            Finalizar Pago
          </h1>

          {/* Customer Information Section - ABOVE payment options */}
          <div className="mb-6 space-y-4 pb-6 border-b border-gray-200">
            <div>
              <label className="block text-sm font-sen font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 font-sen text-apoio focus:outline-none focus:ring-2 focus:ring-apoio focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-sen font-medium text-gray-700 mb-1">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 font-sen text-apoio focus:outline-none focus:ring-2 focus:ring-apoio focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-sen font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 font-sen text-apoio focus:outline-none focus:ring-2 focus:ring-apoio focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Payment Options Section */}
          {/* Google Pay Option */}
          <div className={`mb-4 border border-gray-200 rounded-xl overflow-hidden ${
            paymentMethod === 'googlepay' ? '' : 'bg-white'
          }`}>
            <button
              type="button"
              onClick={() => setPaymentMethod('googlepay')}
              className={`w-full flex items-center justify-start p-4 text-left transition-colors ${
                paymentMethod === 'googlepay' 
                  ? 'bg-gray-50' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === 'googlepay'}
                  onChange={() => setPaymentMethod('googlepay')}
                  className="w-4 h-4 text-apoio focus:ring-apoio"
                />
                <svg className="h-5 w-auto" viewBox="0 0 59 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.3601 11.6862V18.4674H25.208V1.72177H30.9132C32.3591 1.72177 33.592 2.20374 34.6008 3.16768C35.632 4.13162 36.1476 5.30852 36.1476 6.69838C36.1476 8.12187 35.632 9.29877 34.6008 10.2515C33.6032 11.2042 32.3703 11.675 30.9132 11.675H27.3601V11.6862ZM27.3601 3.78415V9.62382H30.958C31.8099 9.62382 32.5272 9.3324 33.0876 8.76076C33.6593 8.18912 33.9507 7.49419 33.9507 6.70959C33.9507 5.9362 33.6593 5.25248 33.0876 4.68084C32.5272 4.08678 31.8211 3.79536 30.958 3.79536H27.3601V3.78415Z" fill="currentColor"></path>
                  <path d="M41.7742 6.63107C43.3658 6.63107 44.6212 7.057 45.5403 7.90885C46.4594 8.7607 46.9189 9.9264 46.9189 11.4059V18.4673H44.8677V16.8757H44.7781C43.8926 18.1871 42.7045 18.8372 41.225 18.8372C39.9584 18.8372 38.9048 18.4673 38.0529 17.7164C37.2011 16.9654 36.7751 16.0351 36.7751 14.9142C36.7751 13.7261 37.2235 12.7846 38.1202 12.0896C39.0169 11.3835 40.2162 11.036 41.7069 11.036C42.9847 11.036 44.0383 11.2714 44.8565 11.7422V11.249C44.8565 10.498 44.5651 9.87035 43.9711 9.34355C43.377 8.81674 42.6821 8.55895 41.8863 8.55895C40.6869 8.55895 39.7342 9.06333 39.0393 10.0833L37.145 8.8952C38.1874 7.38205 39.7342 6.63107 41.7742 6.63107ZM38.9944 14.9478C38.9944 15.5083 39.2298 15.979 39.7118 16.3489C40.1826 16.7188 40.743 16.9093 41.3819 16.9093C42.2898 16.9093 43.0968 16.5731 43.8029 15.9006C44.5091 15.228 44.8677 14.4435 44.8677 13.5356C44.1952 13.0088 43.2649 12.7397 42.0656 12.7397C41.1913 12.7397 40.4628 12.9527 39.8799 13.3674C39.2859 13.8046 38.9944 14.3314 38.9944 14.9478Z" fill="currentColor"></path>
                  <path d="M58.6207 7.00095L51.4472 23.5H49.2279L51.8955 17.7276L47.1655 7.00095H49.5081L52.9155 15.228H52.9604L56.2781 7.00095H58.6207Z" fill="currentColor"></path>
                  <path d="M18.8001 10.3187C18.8001 9.61709 18.7373 8.94569 18.6208 8.30008H9.6001V11.9989L14.7953 12C14.5846 13.2307 13.9064 14.2799 12.8674 14.9793V17.379H15.9598C17.7655 15.7078 18.8001 13.2375 18.8001 10.3187Z" fill="#4285F4"></path>
                  <path d="M12.8685 14.9793C12.0076 15.5599 10.8991 15.8995 9.60228 15.8995C7.09717 15.8995 4.97202 14.2115 4.21096 11.9361H1.021V14.411C2.60141 17.5472 5.84965 19.6992 9.60228 19.6992C12.1959 19.6992 14.3749 18.8462 15.9609 17.3779L12.8685 14.9793Z" fill="#34A853"></path>
                  <path d="M3.91043 10.1002C3.91043 9.46129 4.01691 8.8437 4.21082 8.26309V5.78824H1.02086C0.367396 7.08507 -0.000244141 8.54891 -0.000244141 10.1002C-0.000244141 11.6514 0.368516 13.1153 1.02086 14.4121L4.21082 11.9373C4.01691 11.3567 3.91043 10.7391 3.91043 10.1002Z" fill="#FABB05"></path>
                  <path d="M9.60228 4.29974C11.0179 4.29974 12.2856 4.78731 13.2865 5.74004L16.027 3.00179C14.3626 1.45164 12.1926 0.500031 9.60228 0.500031C5.85077 0.500031 2.60141 2.65208 1.021 5.78824L4.21096 8.26309C4.97202 5.98775 7.09717 4.29974 9.60228 4.29974Z" fill="#E94235"></path>
                </svg>
              </div>
            </button>
            
            {paymentMethod === 'googlepay' && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                {!googlePayAvailable ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 mb-2">Google Pay no está disponible en este dispositivo o navegador.</p>
                    <p className="text-xs text-gray-500">Por favor, use otro método de pago.</p>
                  </div>
                ) : (
                  <>
                    <ul className="space-y-3 mb-4">
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Pago rápido y seguro
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Sin necesidad de ingresar datos de tarjeta
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Protección adicional de Google Pay
                      </li>
                    </ul>
                    <div 
                      id="recurly-googlepay-button"
                      ref={googlePayButtonRef}
                      className="w-full"
                      style={{ minHeight: '48px' }}
                    ></div>
                    {error && paymentMethod === 'googlepay' && (
                      <div className="mt-3 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                        {error}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Apple Pay Option */}
          <div className={`mb-4 border border-gray-200 rounded-xl overflow-hidden ${
            paymentMethod === 'applepay' ? '' : 'bg-white'
          }`}>
            <button
              type="button"
              onClick={() => setPaymentMethod('applepay')}
              className={`w-full flex items-center justify-start p-4 text-left transition-colors ${
                paymentMethod === 'applepay' 
                  ? 'bg-gray-50' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === 'applepay'}
                  onChange={() => setPaymentMethod('applepay')}
                  className="w-4 h-4 text-apoio focus:ring-apoio"
                />
                <svg className="h-5 w-auto" viewBox="0 0 63 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.41022 4.82398C9.5916 4.92293 10.773 4.23026 11.5113 3.35205C12.2374 2.4491 12.7173 1.23692 12.5943 0C11.5483 0.0494767 10.2561 0.692674 9.51777 1.59562C8.84093 2.37488 8.26255 3.63654 8.41022 4.82398ZM22.4638 20.7555V1.47193H29.6628C33.3793 1.47193 35.9758 4.04471 35.9758 7.80494C35.9758 11.5652 33.33 14.1627 29.5644 14.1627H25.4418V20.7555H22.4638ZM12.5819 5.05898C11.5411 4.99877 10.5914 5.37358 9.82438 5.67633C9.33075 5.87116 8.91274 6.03614 8.59472 6.03614C8.23784 6.03614 7.80257 5.86234 7.31387 5.66719C6.6735 5.4115 5.94138 5.11916 5.17364 5.13319C3.41387 5.15793 1.77716 6.15983 0.878819 7.75545C-0.967091 10.9467 0.398882 15.6717 2.18326 18.2693C3.05699 19.5556 4.10301 20.9657 5.48129 20.9163C6.08765 20.8933 6.52383 20.7072 6.97524 20.5147C7.49492 20.293 8.0348 20.0628 8.87776 20.0628C9.69151 20.0628 10.2078 20.287 10.7033 20.5023C11.1746 20.707 11.6271 20.9036 12.2989 20.8915C13.7264 20.8668 14.6247 19.6051 15.4984 18.3187C16.4413 16.9381 16.8557 15.5906 16.9186 15.3861C16.9222 15.3745 16.9246 15.3665 16.9259 15.3625C16.9244 15.361 16.9128 15.3556 16.8922 15.3462C16.577 15.2011 14.1679 14.0926 14.1448 11.1199C14.1216 8.62473 16.0556 7.36054 16.3601 7.16153C16.3786 7.14944 16.3911 7.14125 16.3968 7.137C15.1662 5.30636 13.2464 5.10845 12.5819 5.05898ZM41.4153 20.9039C43.2858 20.9039 45.0209 19.9515 45.8085 18.4424H45.8701V20.7555H48.6266V11.157C48.6266 8.37393 46.4115 6.5804 43.0027 6.5804C39.8401 6.5804 37.5019 8.39866 37.4158 10.8972H40.0985C40.32 9.70979 41.4153 8.93054 42.9166 8.93054C44.7379 8.93054 45.7593 9.78401 45.7593 11.3549V12.4186L42.0429 12.6413C38.5849 12.8516 36.7143 14.274 36.7143 16.7479C36.7143 19.2464 38.6464 20.9039 41.4153 20.9039ZM42.215 18.6156C40.6275 18.6156 39.6184 17.8487 39.6184 16.6736C39.6184 15.4615 40.5906 14.7564 42.4488 14.6451L45.7591 14.4348V15.5233C45.7591 17.3292 44.2332 18.6156 42.215 18.6156ZM57.7699 21.51C56.5762 24.8868 55.2103 26 52.306 26C52.0845 26 51.3461 25.9753 51.1739 25.9258V23.6127C51.3585 23.6375 51.8138 23.6622 52.0476 23.6622C53.3643 23.6622 54.1027 23.1056 54.558 21.6584L54.8288 20.8049L49.7833 6.76594H52.8967L56.4039 18.1579H56.4655L59.9727 6.76594H63L57.7699 21.51ZM25.4416 3.99524H28.875C31.4592 3.99524 32.936 5.38059 32.936 7.81731C32.936 10.254 31.4592 11.6518 28.8627 11.6518H25.4416V3.99524Z" fill="currentColor"></path>
                </svg>
              </div>
            </button>
            
            {paymentMethod === 'applepay' && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                {!applePayAvailable ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 mb-2">Apple Pay no está disponible en este dispositivo o navegador.</p>
                    <p className="text-xs text-gray-500">Por favor, use otro método de pago.</p>
                  </div>
                ) : (
                  <>
                    <ul className="space-y-3 mb-4">
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Pago rápido y seguro
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Sin necesidad de ingresar datos de tarjeta
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Protección adicional de Apple Pay
                      </li>
                    </ul>
                    <div 
                      id="recurly-applepay-button"
                      ref={applePayButtonRef}
                      className="w-full"
                      style={{ minHeight: '48px' }}
                    ></div>
                    {error && paymentMethod === 'applepay' && (
                      <div className="mt-3 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                        {error}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Accordion: Credit Card Option */}
          <div className={`border border-gray-200 rounded-xl overflow-hidden ${
            paymentMethod === 'card' ? '' : 'bg-white'
          }`}>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`w-full flex items-center justify-start p-4 text-left transition-colors ${
                paymentMethod === 'card' 
                  ? 'bg-gray-50' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="w-4 h-4 text-apoio focus:ring-apoio"
                />
                <img src="/assets/cards.webp" alt="Card brands" className="h-5" />
              </div>
            </button>

            {paymentMethod === 'card' && (
              <form id="checkout-form" onSubmit={handleSubmit} className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
                {/* Row 1: Card Number */}
                <div>
                  <label className="block text-sm font-sen font-medium text-gray-700 mb-1">
                    Número de tarjeta
                  </label>
                  <div 
                    id="recurly-card-number"
                    ref={cardNumberRef}
                    className="w-full border border-gray-200 rounded-lg bg-gray-50"
                    style={{ minHeight: '40px', padding: '0' }}
                  ></div>
                </div>

                {/* Row 2: Month | Year | CVC */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-sen font-medium text-gray-700 mb-1">
                      Mes
                    </label>
                    <div 
                      id="recurly-card-month"
                      ref={cardMonthRef}
                      className="w-full border border-gray-200 rounded-lg bg-gray-50"
                      style={{ minHeight: '40px', padding: '0' }}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-sen font-medium text-gray-700 mb-1">
                      Año
                    </label>
                    <div 
                      id="recurly-card-year"
                      ref={cardYearRef}
                      className="w-full border border-gray-200 rounded-lg bg-gray-50"
                      style={{ minHeight: '40px', padding: '0' }}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-sen font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <div 
                      id="recurly-card-cvv"
                      ref={cardCvvRef}
                      className="w-full border border-gray-200 rounded-lg bg-gray-50"
                      style={{ minHeight: '40px', padding: '0' }}
                    ></div>
                  </div>
                </div>

                {/* Row 3: Country */}
                <div>
                  <label className="block text-sm font-sen font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <select
                    id="country"
                    data-recurly="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 font-sen text-apoio focus:outline-none focus:ring-2 focus:ring-apoio focus:border-transparent"
                    required
                  >
                    {countries.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hidden fields for Recurly billing info - as in the working example */}
                <input type="hidden" data-recurly="first_name" value={firstName} />
                <input type="hidden" data-recurly="last_name" value={lastName} />

                {/* Error Message */}
                {error && paymentMethod === 'card' && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !recurlyLoaded}
                  className="w-full bg-apoio text-complementar py-3 px-6 rounded-lg text-base font-sen font-bold shadow-md transition-all duration-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    'Continuar'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Total Display */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-1">Total a pagar</p>
            <p className="text-2xl font-playfair font-bold text-apoio">
              {selectedPrice || quizData.selectedPrice || '$0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
