// Loaded only by the isolated test child. Never forwards external requests.
const nativeFetch = globalThis.fetch;
let sequence = 0;
globalThis.fetch = async (input, init) => {
  const url = String(input);
  if (url === 'https://mission18-test.upstash.io') {
    const id = ++sequence;
    const reply = new Promise(resolve => {
      const listener = message => {
        if (message.id !== id) return;
        process.off('message', listener);
        resolve(message);
      };
      process.on('message', listener);
    });
    process.send({ type: 'reserve', id, command: JSON.parse(init.body) });
    const message = await reply;
    if (message.networkError) throw new TypeError('Simulated offline');
    return new Response(JSON.stringify(message.body), { status: message.status || 200 });
  }
  if (url.startsWith('https://generativelanguage.googleapis.com/')) {
    process.send({ type: 'provider' });
    const request = JSON.parse(init.body);
    const answer = request.generationConfig.responseSchema
      ? JSON.stringify({ title: 'Teste', overview: 'Teste', sections: [{ heading: 'Teste', explanation: 'Teste' }], keyTerms: [], reviewTopics: [] })
      : 'Resposta simulada';
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: answer }] } }] }));
  }
  if (url.startsWith('http://127.0.0.1:')) return nativeFetch(input, init);
  throw new Error('External network forbidden by mission18 test');
};
