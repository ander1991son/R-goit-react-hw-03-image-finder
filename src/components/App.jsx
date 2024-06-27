// import React, { Component } from 'react';
// import Searchbar from './Searchbar/Searchbar';
// import Notiflix from 'notiflix';

// const API_KEY = '41167755-70f3c314cd8390efeff4b47a8';

// export class App extends Component {
//   state = {
//     images: [],
//     query: new URLSearchParams(window.location.search).get('query') || '',
//   };

//   componentDidMount() {
//     const { query } = this.state;
//     if (query) {
//       this.fetchImages(query);
//     }
//   }

//   fetchImages = query => {
//     const API_URL = `https://pixabay.com/api/?q=${query}&page=1&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

//     fetch(API_URL)
//       .then(response => response.json())
//       .then(data => {
//         if (data.hits.length === 0) {
//           Notiflix.Notify.failure('No images found for your search term');
//           return;
//         }
//         this.setState({ images: data.hits });
//       })
//       .catch(error => {
//         console.error('Error fetching images:', error);
//         Notiflix.Notify.failure('Something went wrong. Please try again.');
//       });
//   };

//   handleSubmit = e => {
//     e.preventDefault();
//     const query = e.target.elements.searchQuery.value.trim();

//     if (!query) {
//       Notiflix.Notify.warning('Please enter a search term');
//       return;
//     }

//     this.setState({ query }, () => {
//       this.updateQueryParam(query);
//       this.fetchImages(query);
//     });
//   };

//   updateQueryParam = query => {
//     const url = new URL(window.location);
//     url.searchParams.set('query', query);
//     window.history.pushState({}, '', url);
//   };

//   render() {
//     const { images, query } = this.state;

//     return (
//       <>
//         <Searchbar onSubmit={this.handleSubmit} initialQuery={query} />
//         {query && <h2>Results for "{query}"</h2>}
//         <div>
//           {images.map(image => (
//             <img key={image.id} src={image.webformatURL} alt={image.tags} />
//           ))}
//         </div>
//       </>
//     );
//   }
// }

// export default App;

import React, { Component } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import Notiflix from 'notiflix';

const API_KEY = '41167755-70f3c314cd8390efeff4b47a8';

export class App extends Component {
  state = {
    images: [],
    query: new URLSearchParams(window.location.search).get('query') || '',
    page: 1,
    loading: false,
    showModal: false,
    largeImageURL: '',
    alt: '',
  };

  componentDidMount() {
    const { query } = this.state;
    if (query) {
      this.fetchImages(query, 1);
    }
  }

  fetchImages = (query, page) => {
    this.setState({ loading: true });

    const API_URL = `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        if (data.hits.length === 0) {
          Notiflix.Notify.failure('No images found for your search term');
          return;
        }
        this.setState(prevState => ({
          images: [...prevState.images, ...data.hits],
          page,
          loading: false,
        }));
      })
      .catch(error => {
        console.error('Error fetching images:', error);
        Notiflix.Notify.failure('Something went wrong. Please try again.');
        this.setState({ loading: false });
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    const query = e.target.elements.searchQuery.value.trim();

    if (!query) {
      Notiflix.Notify.warning('Please enter a search term');
      return;
    }

    this.setState({ query, images: [], page: 1 }, () => {
      this.updateQueryParam(query);
      this.fetchImages(query, 1);
    });
  };

  handleLoadMore = () => {
    const { query, page } = this.state;
    this.fetchImages(query, page + 1);
  };

  updateQueryParam = query => {
    const url = new URL(window.location);
    url.searchParams.set('query', query);
    window.history.pushState({}, '', url);
  };

  openModal = (largeImageURL, alt) => {
    this.setState({ showModal: true, largeImageURL, alt });
  };

  closeModal = () => {
    this.setState({ showModal: false, largeImageURL: '', alt: '' });
  };

  render() {
    const { images, query, loading, showModal, largeImageURL, alt } =
      this.state;

    return (
      <>
        <Searchbar onSubmit={this.handleSubmit} initialQuery={query} />
        {query && <h2>Results for "{query}"</h2>}
        {loading && <Loader />}
        <ImageGallery images={images} onImageClick={this.openModal} />
        {images.length > 0 && !loading && (
          <Button onClick={this.handleLoadMore} />
        )}
        {showModal && (
          <Modal
            largeImageURL={largeImageURL}
            alt={alt}
            onClose={this.closeModal}
          />
        )}
      </>
    );
  }
}

export default App;
