test('Salon website renders without errors',async () => {

    const response = await fetch('https://stswengnaturelle.onrender.com/');
    const body = await response.text();
    expect(response.status).toBe(200);

  });


test('Salon login page renders without errors',async () => {

    const response = await fetch('https://stswengnaturelle.onrender.com/login');
    const body = await response.text();
    expect(response.status).toBe(200);

  });

test('Salon register page renders without errors',async () => {

    const response = await fetch('https://stswengnaturelle.onrender.com/register');
    const body = await response.text();
    expect(response.status).toBe(200);

  });

test('Salon about page renders without errors',async () => {

    const response = await fetch('https://stswengnaturelle.onrender.com/about');
    const body = await response.text();
    expect(response.status).toBe(200);

  });

