import loginBlur from '../../../assets/images/Client/login/login-blur.svg';
import loginLayer1 from '../../../assets/images/Client/login/image-layer-1.png';
import loginLayer2 from '../../../assets/images/Client/login/image-layer-2.png';
import loginLayer3 from '../../../assets/images/Client/login/image-layer-3.png';

const LoginDecoration = () => {
    return (
        <>
            <div className="flex relative w-1/2">
                <img src={loginBlur} alt="login-blur" className="w-full h-full" />
                <img src={loginLayer1} alt="layer-1" className="absolute bottom-14 right-2 w-10/12" />
                <img src={loginLayer2} alt="layer-2"
                    className="absolute bottom-10 -right-6 w-10/12 blur-sm opacity-90" />
                <img src={loginLayer3} alt="layer-3" className="absolute bottom-20 right-6 w-10/12" />
            </div>
        </>
    )
}

export default LoginDecoration;