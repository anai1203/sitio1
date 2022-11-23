import { addDoc, collection, getDoc, doc, updateDoc } from 'firebase/firestore';
import React, {useState,useEffect} from 'react'
import {db} from "./firebase";

const AppForm = (props) => {
    ///////////////////////////////////////////////////////////////////////
    ////////// CREAR - fnCrear - Guardar //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    const camposRegistro = {nombre:"", edad:"", genero:""};
    const [objeto, setObjeto] = useState(camposRegistro);

    const handleStatusChange = (e) => {      //Manejar cambios en form
        const {name, value} = e.target;
        setObjeto({...objeto, [name]:value });
        console.log(objeto);
    };

    const handleSubmit = async(e) => {
        try {
            e.preventDefault();
            if(props.idActual === ""){
                if(validarForm()){
                    addDoc(collection(db, 'persona'), objeto);
                    console.log("Se guardo registro en BD...");
                }else{
                    console.log("NO se guardo...");
                }
            }else{
                await updateDoc(doc(collection(db,"persona"),props.idActual), objeto);
                console.log("Se actualizo registro...")
                props.setIdActual("");
            }
            setObjeto(camposRegistro);
        } catch (error) {
            console.error();
        } 
    };
    
    const validarForm = () => {
         if(objeto.nombre === ""){
            alert("Escriba nombre...");
            return false;
         }
         return true;
    };
    useEffect(() => {
        if( props.idActual === ""){
            setObjeto({...camposRegistro});
        } else{
            obtenerDatosPorId(props.idActual);
        }
    }, [props.id]);
    const obtenerDatosPorId = async(xId) => {
         const objPorId = doc(db, "persona", xId);
         const docPorId = await getDoc(objPorId);
         if (docPorId.exists()){
            setObjeto(docPorId.data());
         } else{
            console.log("No hay datos en doc...");
         }
         
    };

    ///////////////////////////////////////////////////////////////////////
    ////////// UPDATE - fnUpdate - Actualizar /////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    return (
        <div //style={{background:"orange", padding:"10px", margin:"10px"}}
        >
            <h3>CREAR / UPDATE</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" name='nombre' placeholder='Nombres...' 
                    onChange={handleStatusChange} value={objeto.nombre}
                />

                <input type="text" name='edad' placeholder='Edad...' 
                    onChange={handleStatusChange} value={objeto.edad}
                />

                <input type="text" name='genero' placeholder='Genero...' 
                    onChange={handleStatusChange} value={objeto.genero}
                />
                <button>
                    {props.idActual === "" ? "Guardar" : "Actualizar" }
                </button>
            </form>
            
        </div>
    )
}

export default AppForm
