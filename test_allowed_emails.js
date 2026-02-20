// Script de teste para verificar allowedEmails
// Execute no console do navegador quando logado como admin

async function testAllowedEmails() {
  try {
    console.log('🔍 Testando leitura da coleção allowedEmails...');

    const db = firebase.firestore();
    const allowedEmailsRef = db.collection('allowedEmails');
    const snapshot = await allowedEmailsRef.get();

    console.log('✅ Leitura bem-sucedida!');
    console.log('📊 Total de e-mails permitidos:', snapshot.size);

    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📧', data.email, data.isAdmin ? '(Admin)' : '(Usuário)');
    });

    // Testar query específica
    const testEmail = prompt('Digite um e-mail para testar a query:');
    if (testEmail) {
      console.log('🔍 Testando query para e-mail:', testEmail);
      const q = allowedEmailsRef.where('email', '==', testEmail);
      const querySnapshot = await q.get();

      if (!querySnapshot.empty) {
        console.log('✅ E-mail encontrado na lista!');
        querySnapshot.forEach((doc) => {
          console.log('📄 Dados:', doc.data());
        });
      } else {
        console.log('❌ E-mail NÃO encontrado na lista');
      }
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testAllowedEmails();