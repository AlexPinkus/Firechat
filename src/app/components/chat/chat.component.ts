import { Component, OnInit } from '@angular/core';
import { ChatService } from "../../providers/chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {
  mensaje: string="";
  elemento: any;
  constructor(public _cs:ChatService) {
    this._cs.cargarMensajes().subscribe(()=>{
      setTimeout(()=>{
        this.elemento.scrollTop =this.elemento.scrollHeight;
      },20)
    });
    // (mensajes: any[])=>{
    //  console.log(mensajes);
    // });
  }

  ngOnInit() {
    this.elemento=document.getElementById("app-mensajes");
  }

  enviarMensaje(){
    console.log(this.mensaje)
    if(this.mensaje.length >=0){
      this._cs.agregarMensaje(this.mensaje).then(()=>{
        this.mensaje="";
        console.log('Mensaje enviado')})
      .catch((err)=>console.log('Error al enviar', err))
    }
    return;
  }

}
