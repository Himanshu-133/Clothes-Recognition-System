'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Camera, Loader2 } from 'lucide-react'
import { clothingDataset } from '@/lib/clothing-dataset'

interface ImageCaptureProps {
  onRecognized: (itemId: string, imageUrl: string) => void
}

export function ImageCapture({ onRecognized }: ImageCaptureProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCamera, setShowCamera] = useState(false)

  const recognizeClothing = async (imageData: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/recognize-clothing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      })
      const result = await response.json()
      
      if (result.itemId) {
        onRecognized(result.itemId, imageData)
        setPreview(null)
      }
    } catch (error) {
      console.error('Recognition failed:', error)
      alert('Could not recognize clothing. Please try another image.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageData = event.target?.result as string
      setPreview(imageData)
    }
    reader.readAsDataURL(file)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (error) {
      console.error('Camera access denied:', error)
      alert('Could not access camera')
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      context?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
      const imageData = canvasRef.current.toDataURL('image/jpeg')
      setPreview(imageData)
      setShowCamera(false)
      if (videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
    setShowCamera(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Recognize Your Clothes</h2>

      {!showCamera && !preview && (
        <div className="space-y-3">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2"
            variant="default"
          >
            <Upload className="w-4 h-4" />
            Upload Photo
          </Button>

          <Button
            onClick={startCamera}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Camera className="w-4 h-4" />
            Take Photo
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {showCamera && (
        <div className="space-y-3">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={capturePhoto} className="flex-1">Capture</Button>
            <Button onClick={stopCamera} variant="outline" className="flex-1">Cancel</Button>
          </div>
          <canvas ref={canvasRef} width={320} height={256} className="hidden" />
        </div>
      )}

      {preview && !showCamera && (
        <div className="space-y-3">
          <div className="relative bg-slate-100 rounded-lg overflow-hidden">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-64 object-cover" />
          </div>
          <Button
            onClick={() => recognizeClothing(preview)}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Recognize Clothing'
            )}
          </Button>
          <Button
            onClick={() => setPreview(null)}
            variant="outline"
            className="w-full"
          >
            Try Another
          </Button>
        </div>
      )}
    </div>
  )
}
