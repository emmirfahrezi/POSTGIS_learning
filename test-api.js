fetch('http://localhost:3000/api/location/1', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Bundaran HI',
    address: 'Jl. M.H. Thamrin, Jakarta Pusat',
    longitude: 106.823055,
    latitude: -6.195021
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
