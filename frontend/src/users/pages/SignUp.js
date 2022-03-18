import React, {useRef} from 'react';
import Wrapper from '../../shared/components/UIElements/Wrapper';
import Input from '../../shared/components/UIElements/Input';

const SignUp = () => {
  const refName = useRef("");
  const refEmail = useRef("");
  const refPassword = useRef("");
  const refImage = useRef();

  

  const onSubmitHandler = async () =>{
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}users/signup`,{
        method: "POST",
        body: JSON.stringify({   
          name: refName.current.value,
          email: refEmail.current.value,
          password: refPassword.current.value,
          image_url: refImage.current.value //just temporarily until our backend is prepered for image upload...
        }),
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = await response.json();
      console.log(data);
    } catch (error){
      console.log(error.message);
    }

  }

  return (
    <Wrapper>
      <Input ref={refName} type="text" name="name" placeholder="your name..." label="User Name : "/>
      <Input ref={refEmail} type="email" name="email" placeholder="your email..." label="User Email : "/>
      <Input ref={refPassword} type="password" name="password" placeholder="your password..." label="User Password : "/>
      <Input ref={refImage} type="url" name="image" placeholder="your image url ..." label="User Picture : "/>
      {/* <Input ref={refImage} type="file" name="image" accept=".jpg,.png,.jpeg" label="User Picture : "/> */}
      <button className="btn btn-info" onClick={onSubmitHandler}>signup</button>
    </Wrapper>
  )
}

export default SignUp;