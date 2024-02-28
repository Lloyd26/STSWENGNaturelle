test('Salon website renders without errors',async () => {
    // Assuming your web app is accessible through a URL
    const response = await fetch('https://your-salon-website-url');
    const body = await response.text();
    expect(response.status).toBe(200);
    // Add more specific assertions based on your page structure
  });