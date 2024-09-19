'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Combobox } from '@headlessui/react'

interface LocationProps {
  onSelectLocation: (location: string) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
}

export function Location({ onSelectLocation }: LocationProps) {
  const [address, setAddress] = useState('')
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 40.4168, lng: -3.7038 })
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const geocoder = useRef<google.maps.Geocoder | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places']
    })

    loader.load().then(() => {
      if (mapRef.current) {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: 15,
        })
        markerRef.current = new google.maps.Marker({ position: mapCenter, map: mapInstanceRef.current })
      }
      autocompleteService.current = new google.maps.places.AutocompleteService()
      geocoder.current = new google.maps.Geocoder()
    })
  }, [])

  const handleAddressChange = async (value: string) => {
    setAddress(value)
    if (!autocompleteService.current) return

    try {
      const results = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
        autocompleteService.current?.getPlacePredictions(
          { input: value },
          (predictions, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              reject(status)
            } else {
              resolve(predictions || [])
            }
          }
        )
      })
      setSuggestions(results)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    }
  }

  const handleSelectAddress = useCallback((value: string) => {
    setAddress(value);
    onSelectLocation(value);
    
    if (geocoder.current && mapInstanceRef.current && markerRef.current) {
      geocoder.current.geocode({ address: value }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results?.[0]?.geometry?.location) {
          const newCenter = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          setMapCenter(newCenter);
          mapInstanceRef.current?.setCenter(newCenter);
          markerRef.current?.setPosition(newCenter);
        }
      });
    }
  }, [onSelectLocation]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSelectAddress(address);
    }
  }, [address, handleSelectAddress]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Please select your location</h2>
      <Combobox value={address} onChange={handleSelectAddress}>
        <Combobox.Input
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          onChange={(event) => handleAddressChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Combobox.Options className="mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md">
          {suggestions.map((suggestion) => (
            <Combobox.Option key={suggestion.place_id} value={suggestion.description} className="cursor-default select-none py-2 px-3 hover:bg-gray-100">
              {suggestion.description}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
      <div ref={mapRef} style={mapContainerStyle}></div>
    </div>
  )
}