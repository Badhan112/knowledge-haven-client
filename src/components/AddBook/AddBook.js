import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import { UserContext } from '../../App';

const AddBook = () => {
    const [user] = useContext(UserContext);
    const [newBook, setNewBook] = useState({
        name: '',
        author: '',
        price: '',
        userName: user.name,
        userEmail: user.email,
    });
    const bookCoverImage = {
        imgUrl: '',
    }
    const [imageData, setImageData] = useState();
    const [isSendingData, setIsSendingData] = useState(false);

    const handleInputField = event => {
        const bookInfo = { ...newBook };
        bookInfo[event.target.name] = event.target.value;
        setNewBook(bookInfo);
    }

    const handleFileInput = event => {
        const data = new FormData();
        data.set('key', '617888b32f13454101eca1608e88c1dc');
        data.append('image', event.target.files[0]);
        setImageData(data);
    }

    const handleFormSubmit = event => {
        setIsSendingData(true);
        axios.post('https://api.imgbb.com/1/upload', imageData)
            .then(res => {
                bookCoverImage.imgUrl = res.data.data.display_url;
            })
            .then(() => {
                const newBookInfo = { ...newBook, ...bookCoverImage };
                fetch('http://localhost:1712/addBook', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newBookInfo),
                })
                .then(result => {
                    setIsSendingData(false);
                    if(result){
                        alert("Book Information Added Successfully");
                    }
                });
            })
            .catch(error => {
                console.log(error);
            });
        event.preventDefault();
    }

    return (
        <>{
            isSendingData 
            ? <div style={{width: "100%", textAlign: "center"}}>
                <CircularProgress
                    size={100}
                    thickness={4}
                />
            </div>
            : <div>
                <h3>Add Book</h3>
                <Form onSubmit={handleFormSubmit}>
                    <Form.Group>
                        <Form.Label>Book Name</Form.Label>
                        <Form.Control name="name" onBlur={handleInputField} required type="text" placeholder="Enter Name" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Author Name</Form.Label>
                        <Form.Control name="author" onBlur={handleInputField} required type="text" placeholder="Enter Name" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Add Price</Form.Label>
                        <Form.Control name="price" onBlur={handleInputField} required type="number" placeholder="Enter Price" />
                    </Form.Group>
                    <Form.Group>
                        <Form.File onChange={handleFileInput} required label="Add Book Cover Photo" />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            </div>}
        </>
    );
};

export default AddBook;