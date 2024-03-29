import React, { useState } from 'react';

const productsData = [
  { id: 1, name: 'Süt' },
  { id: 2, name: 'Yumurta' },
  { id: 3, name: 'Gluten' },
  { id: 4, name: 'Fıstık' },
  // Daha fazla ürün eklenebilir.
];

function AlerjiListesi() {
  const [query, setQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

  const filteredProducts = query
    ? productsData.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const addProduct = (product) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeProduct = (id) => {
    setSelectedProducts(selectedProducts.filter(product => product.id !== id));
  };

  // Inline styles
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '0px', // Sayfa başlangıcından itibaren üst boşluk
      width: '50%', // Sayfa genişliğinin %50'sini kaplar
      minWidth: '300px', // Minimum genişlik
      maxWidth: '600px', // Maksimum genişlik
      height: '100vh', // Yükseklik, viewport'un yüksekliği ile aynı olacak
    },
    header: {
      fontSize: '24px',
      color: '#333',
      margin: '10px 0',
    },
    panel: {
      border: '2px solid #007bff', // Renkli çerçeve
      borderRadius: '5px',
      padding: '10px',
      width: '100%',
      boxSizing: 'border-box', // Padding'i genişliğe dahil et
      marginBottom: '20px',
    },
    selectedProducts: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    product: {
      margin: '5px',
      padding: '5px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    searchInput: {
      padding: '10px',
      marginBottom: '10px',
      width: 'calc(100% - 20px)', // Çerçevenin içinde doğru oturması için
      border: 'none',
    },
    productList: {
      width: '100%',
    },
    saveButton: { // Yeni buton için stil tanımı
      padding: '10px 20px',
      margin: '10px 0', // Butonun üst ve altında biraz boşluk
      backgroundColor: 'green', // Yeşil arka plan
      color: 'white', // Beyaz yazı rengi
      fontSize: '16px', // Font büyüklüğü
      border: 'none', // Çerçevesiz
      borderRadius: '5px', // Hafif yuvarlak köşeler
      cursor: 'pointer', // Fare imlecini tıklanabilir olarak değiştir
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Alerji Listesi</div>
      <div style={styles.panel}>
        <div style={styles.selectedProducts}>
          {selectedProducts.map(product => (
            <div key={product.id} style={styles.product} onClick={() => removeProduct(product.id)}>
              {product.name}
            </div>
          ))}
        </div>
      </div>
      <div style={styles.panel}>
        <input
          type="text"
          placeholder="Ürün ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.productList}>
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => addProduct(product)}
              style={styles.product}
            >
              {product.name}
            </div>
          ))}
        </div>
      </div>
      <button style={styles.saveButton}>Kaydet</button>
    </div>
  );
}

export default AlerjiListesi;