import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mensaje } from "../interfaces/mensaje.interface"

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[]=[];
  public usuario: any={};

  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) {
    
    this.afAuth.authState.subscribe(user=>{
      console.log("Estado del usuario", user);
      if(!user){ return; }
      this.usuario.nombre =user.displayName;
      this.usuario.uid    =user.uid;
    })
    // this.itemsCollection = afs.collection<Mensaje>('items');
    // this.items = this.itemsCollection.valueChanges();
  }
  // addItem(item: Item) {
  //   this.itemsCollection.add(item);
  // }

  login(proveedor:string) {
    if(proveedor==='google'){
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
    else if(proveedor==='twitter'){
      this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());
    }
  }

  logout() {
    this.usuario={};
    this.afAuth.auth.signOut();
  }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref=>ref.orderBy('fecha','desc').limit(5));
    return this.itemsCollection.valueChanges().pipe(map( (mensajes: Mensaje[]) =>{
      console.log(mensajes);
      this.chats =[];
      for (let mensaje of mensajes) {
        this.chats.unshift(mensaje);
      }
      return this.chats;
      //this.chats=mensajes;
    }));

  }

  agregarMensaje( texto:string ){
    let mensaje: Mensaje={
      mensaje: texto,
      nombre: this.usuario.nombre,
      uid: this.usuario.uid,
      fecha: new Date().getTime()
    }
    return this.itemsCollection.add( mensaje );
  }

}
