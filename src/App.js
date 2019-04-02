import React, { Component } from 'react';
import './App.css';
import Card from '@material-ui/core/Card';
import Button from "@material-ui/core/Button";
const IMG_1 = "https://img.lun.ua/construction-800x450/188923.jpg";
const IMG_2 = "https://img.lun.ua/construction-800x450/185986.jpg";
const HEIGHT = 125;
const WIDTH = 360;
var similarity = 0.0;

function BaseCard() {
    return (
        <Card className='base-card'>
            <div className="card-header">
                <div className="card-name"> Point 1 (building 1)</div>
            </div>
            <div className='left-area'>
                <div className='image-back'>
                    <img id='static-image' src={IMG_1} width={WIDTH}/>
                </div>
            </div>
            <div className='central-area'>
                <p className='previewText'>Similarity</p>
                <p id='result' className='result-label'>{similarity + '%'}</p>
            </div>
            <div className='right-area'>
                <div className='box-for-input'>
                    <ImageUpload/>
                </div>
            </div>
        </Card>
    );
}

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {file: '', imagePreviewUrl: ''};
    }

    _handleSubmit(e) {
        e.preventDefault();

        const data = new FormData();
        data.append('file', this.state.file);
        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: data,
            mode: 'cors',
        }).then(function(response) {
            console.log(response);
            response.json().then(function(data) {
                similarity = data['similarity'];
                document.getElementById('result').innerText = similarity + '%';
                console.log(data['similarity']);
            });
        });
        console.log('handle uploading-', this.state.file);
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        };
        reader.readAsDataURL(file)
    }

    render() {
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} width={WIDTH} />);
        } else {
            $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
        }

        return (
            <div className="previewComponent">
                <form onSubmit={(e)=>this._handleSubmit(e)}>
                    <input className="fileInput"
                           type="file"
                           onChange={(e)=>this._handleImageChange(e)} />
                    <button className="submitButton"
                            type="submit"
                            onClick={(e)=>this._handleSubmit(e)}>Upload Image</button>
                </form>
                <div className="imgPreview">
                    {$imagePreview}
                </div>
            </div>
        )
    }
}

class ImageUpLoader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageURL: '',
        };

        this.handleUploadImage = this.handleUploadImage.bind(this);
    }

    handleUploadImage(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        //data.append('filename', this.fileName.value);

        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: data,
            mode: 'no-cors'
        }).then((response) => {
            console.log(response);
            /*response.json().then((body) => {
                this.setState({ imageURL: `http://localhost:5000/${body.file}` });
            });*/
        });
    }

    render() {
        return (
            <form onSubmit={this.handleUploadImage}>
                <div className='input-block'>
                    <img src={this.state.imageURL} alt="img" />

                    <p className='minor-lable'>Выберите файл или перетащите сюда</p>
                    <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                    <p className='minor-lable'>test.img</p>

                </div>
                <div className='upload-button-block'>
                    <button>Upload</button>
                </div>

            </form>
        );
    }
}

class Panel extends React.Component {
    state = {
        res: '0.0'
    };

    renderBaseCard() {
        return(
            <BaseCard />
        );
    }
    render(){
        return(
            <div>
                {this.renderBaseCard()}
            </div>
        );
    }
}

class App extends Component {
    render() {
    return (
      <div className="App">
        <header className="App-header">
            <Panel/>
        </header>
      </div>
    );
  }
}

export default App;
