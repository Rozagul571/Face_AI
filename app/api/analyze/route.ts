import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse the request body with better error handling
    let body
    try {
      body = await request.json()
      console.log("Successfully parsed request body")
    } catch (error) {
      console.error("JSON parsing error:", error)
      // Return a more detailed error response
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          details: "Make sure you're sending properly formatted JSON data",
        },
        { status: 400 },
      )
    }

    const { image } = body || {}

    if (!image) {
      console.error("No image provided in request body")
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Get the API URL and key from environment variables
    const apiUrl = process.env.ROBOFLOW_API_URL
    const apiKey = process.env.ROBOFLOW_API_KEY

    if (!apiUrl || !apiKey) {
      console.error("Missing API configuration:", { apiUrl: !!apiUrl, apiKey: !!apiKey })
      return NextResponse.json({ error: "API configuration missing" }, { status: 500 })
    }

    console.log(`Making request to Roboflow API: ${apiUrl}`)

    // Make the API call to Roboflow
    try {
      const response = await fetch(`${apiUrl}?api_key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Roboflow API error (${response.status}):`, errorText)
        return NextResponse.json(
          { error: `Roboflow API request failed with status ${response.status}` },
          { status: response.status },
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (fetchError) {
      console.error("Fetch error:", fetchError)
      return NextResponse.json({ error: "Error fetching from Roboflow API" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in analyze API route:", error)

    // Return mock data as fallback
    const mockData = {
      predictions: [
        { x: 120, y: 150, width: 40, height: 40, class: "papule", confidence: 0.92 },
        { x: 200, y: 180, width: 30, height: 30, class: "pustule", confidence: 0.87 },
        { x: 280, y: 140, width: 35, height: 35, class: "blackhead", confidence: 0.79 },
        { x: 150, y: 200, width: 25, height: 25, class: "whitehead", confidence: 0.85 },
        { x: 320, y: 220, width: 45, height: 45, class: "nodule", confidence: 0.72 },
      ],
      time: 0.5,
    }

    return NextResponse.json(mockData)
  }
}
