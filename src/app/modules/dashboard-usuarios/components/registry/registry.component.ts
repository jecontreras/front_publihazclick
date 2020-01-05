import { Component, OnInit, ChangeDetectionStrategy, DoCheck } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { ToolsService } from 'src/app/modules/dashboard-usuarios/dashboard-user/services/tools.service';
import { departamento } from '../../json/departamentos';
import { pais } from '../../json/paises';
import * as _ from 'lodash';
import swal from 'sweetalert';
@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss'],
  providers: [UserService]
})
export class RegistryComponent implements OnInit {
  private response: any;
  public cabeza: string;
  public disabled = false;
  public disabledcabeza = true;
  public disabledusername = true;
  public disabledemail = true;
  public disabledpassword = true;
  public disabledPassCount = true;
  public btsdisabled: any;
  public panelOpenState = false;
  public verificacion = false;
  public disabledpais = false;
  public listdepartamento: any = [];
  public listciudades: any = [];
  public listpais: any = [];
  public politicas: string;
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activate: ActivatedRoute,
    private userService: UserService,
    private _authSrvice: AuthService,
    private _tools: ToolsService
  ) {
    if (this._authSrvice.isLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
    this.cabeza = (this.activate.snapshot.paramMap.get('username'));
    this.politicas = '';
    // console.log(this.cabeza);
  }

  ngOnInit() {
    this.politicas = this.loadPoliticas();
    this.listdepartamento = departamento;
    this.listpais = pais;
    // console.log(this.listdepartamento);
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      celular: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirpassword: ['', [Validators.required, Validators.minLength(6)]],
      cabeza: [this.cabeza, [Validators.required]],
      pais: ['Colombia'],
      departamento: [''],
      ciudad: [''],
      aceptarpoliticas: ['h', [Validators.required]]
    });
    this.getCabeza();
  }
  getCabeza() {
    this.userService.cabeza(this.cabeza)
      .subscribe(
        (res: any) => {
          res = res.data[0];
          // console.log(res);
          if (!res) {
            this.disabledcabeza = false;
          }
        }
      )
      ;
  }
  validadUsername() {
    // console.log(this.registerForm.value);
    const
      data: any = this.registerForm.value
      ;
    this.disabledusername = true;
    if (data.username) {
      // console.log(data.username.replace(/ /g, ""));
      this.registerForm.patchValue({ username: data.username.replace(/ /g, '') });
      this.userService.cabeza(data.username)
        .subscribe(
          (res: any) => {
            res = res.data[0];
            // console.log(res);
            if (res) {
              this.disabledusername = false;
            }
          }
        )
        ;
    }
  }
  validadEmail() {
    const
      data: any = this.registerForm.value
      ;
    this.disabledemail = true;
    if (data.email) {
      const
        filtro: any = data.email.split('@', '2')
        ;
      // console.log(filtro);
      if (filtro[1] !== 'gmail.com') {
        this.disabledemail = false;
      }
    }
  }
  validadPassword(opt: any) {
    const
      data: any = this.registerForm.value
      ;
    this.disabledpassword = true;
    this.disabledPassCount = true;
    if (!opt) {
      if (data.password !== data.confirpassword) {
        this.disabledpassword = false;
      }
    } else {
      // console.log(data.password.length);
      if (data.password.length <= 6) {
        this.disabledPassCount = false;
      }
    }
  }

  blurdepartamento() {
    // console.log(this.registerForm.value);
    const data: any = this.registerForm.value;
    let idx: any = 0;
    idx = _.findIndex(this.listdepartamento, ['departamento', data.departamento]);
    // console.log(idx);
    if (idx > -1) {
      // console.log(this.listdepartamento[idx]);
      this.listciudades = this.listdepartamento[idx].ciudades;
    }
  }

  viewpais() {
    const
      data: any = this.registerForm.value
      ;
    // console.log(data);
    this.disabledpais = true;
    if (data.pais === 'Colombia') {
      this.disabledpais = false;
    }

  }


  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    // console.log(this.registerForm.value);
    if (this.disabledemail && this.disabledusername && this.registerForm.value.departamento && this.registerForm.value.pais
      && this.registerForm.value.ciudad && this.registerForm.value.password === this.registerForm.value.confirpassword) {
      this.userService.register(this.registerForm.value).subscribe(
        (response: any) => {
          // console.log(response);
          if (response.status === 200) {
            // TODO Funcionalidad de verificacion
            this.verificacion = true;
            swal('Ok!',
              'Registro completo! Falta Que Actives Tu Cuenta En Gmail Te Enviamos Un Correo de Verificacion a Tu Email: '
              + this.registerForm.value.email, 'success');
            localStorage.setItem('user', JSON.stringify(response.data));
            this.router.navigate(['dashboard']);
          } else {
            swal('Error!', 'No se pudo registrar  revisa los datos ingresados o prueba un nombre de usuario diferente!', 'error');
          }
        },
        error => {
          swal('Error!', 'Los datos son incorrectos o el usuario ya existe!', 'error');
        }
      );
    } else {
      swal('Error!', 'Por Favor Mirar Los Errores que Salen en El Formulario y Llenarlos Todos Para Continuar Gracias!', 'error');
    }
  }

  resolved(obj: any) {
    let value: any = false;
    const registre: any = this.registerForm.controls.aceptarpoliticas;
    if (obj) {
      this.btsdisabled = obj;
    }
    if (!this.registerForm.controls.aceptarpoliticas.value || this.registerForm.controls.aceptarpoliticas.value === 'h') {
      value = !value;
      registre.value = true;
      // this.registerForm.setValue({aceptarpoliticas: false});
    }
    if (value && this.btsdisabled) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }
  loadPoliticas() {
    return `
    Estos Términos y Condiciones se le aplican como miembro, siendo usuario de PUBLICKHAZ CLICK.COM
Al registrarse y/o iniciar sesión en PUBLICKHAZ CLICK.COM , confirma que ha leído, entendido y aceptado
 los siguientes términos y condiciones. Si no está de acuerdo con alguno de estos términos, no se debe
 registrar ni iniciar sesión en nuestro sitio.

1. FORO, CHAT Y COMPORTAMIENTO DE LOS USUARIOS

1.1. Tiene acceso a leer el Foro, excepto las áreas que Administración considere privadas.
1.2. Una vez registrado y con la sesión iniciada, podrá publicar nuevos temas y responder en los
 previamente creados en el Foro así como utilizar el sistema de Mensajes Privados o Inbox.
1.3. Debe respetar a otros usuarios en el Foro y en el sistema de Mensajes Privados, pudiendo ser
 expulsado de los mismos si no se hace.
1.4. Tiene el derecho de expresarse sin ofender a otros usuarios.
1.5. Cualquier acusación sin fundamentos, intimidación, amenaza o falta de respeto hacia
PUBLICKHAZ CLICK.COM
 y/o su personal, colaboradores o miembros, aquí o en cualquier otro lugar, será vista como
 irrespetuosa y podría conllevar a la eliminación de los privilegios de uso de Foro y/o sistema
  de Mensajes Privados, así como una suspensión permanente o temporal de su cuenta o cualquier otro
   beneficio.
1.6. La creación de nuevos temas o mensajes que puedan directa o indirectamente ser perjudiciales
 para PUBLICKHAZ CLICK.COM, sus miembros, o proveedores de servicios será considerado una ofensa
 y está completamente prohibido.

2. CUENTA DE USUARIO
2.1. Una vez creas tu cuenta de usuario tendrás 15 días para activarla, de lo contrario tu cuenta
 será eliminada, a fin de no llenar nuestras bases de datos de usuarios inactivos. Aunque podrás
  volver a crear tu cuenta una segunda vez con los mismos datos y tendrás nuevamente 15 días para
   activarla esto mismo podrás hacer 3 veces si no la activas la tercera vez ya para un cuarto intento
    de registro nuestro sistema no aceptara tus datos
2.2. Como su contraseña debe ser mantenida en secreto nosotros la almacenamos en un formato que solo
 nos permitirá reenviarla a su correo electrónico de Gmail no funciona para ningún otro correo solo
 Gmail En el caso de que olvide la contraseña de su cuenta nos haremos responsables. Solo si tienes
  acceso al correo Gmail que suministraste al momento de tu registro  el sistema enviará mediante
   un proceso automatizado una nueva (generada aleatoriamente) por correo electrónico de Gmail.
2.3. Puedes tener tantos invitados como quieras con datos reales desde tu misma dirección IP*wifi*
 nuestro sistema está conectado a un software que nos permite validar si los datos utilizados para
  crear una cuenta son reales o son datos ficticios
Las personas que se registren bajo tu enlace para hacer parte de tu equipó tendrán una fecha límite
 de 15 días para haber creado y registrado sus cuentas bancarias las cuales deben estar a nombre de
  cada usuario registrado en nuestro sistema para validar que son usuarios con datos reales de lo contrario
   dichos usuarios serán eliminados y con él las ganancias que le allá generado a quien le invito todas
    las actividades de dicho usuario que no cumpla este requisito serán eliminadas
. Cualquier intento de crear cuentas falsas conllevará la suspensión de todas ellas. y también el usuario
 que está intentado registrar personas con datos falsos bajo su línea de invitados También se aplica a su
  cuenta bancaria que tiene que ser única y no compartida con otro usuario para retiradas de dinero.
2.4. Los anuncios pueden ser vistos desde una misma IP por un sin límite de usuario pero cada usuario debe
 tener su propio dispositivo no podrá compartir su dispositivo para que se hagan los  clicks
2.5. Su dirección de correo electrónico y su número de contacto solo será mostrada a quien le invito si
 usted así lo autoriza al momento de su registro en nuestro sitio web
Sus vías de contacto no serán mostradas, dada ni vendida a más nadie, para dar cumplimiento a la ley de Habeas Data.
2.6. Las cuentas no son transferibles.
2.7. PUBLICKHAZ CLICK.COM le permitirá a cada usuario  modificar en el momento que el usuario lo desee
 desde su propia oficina virtual información personal de las cuentas por petición de sus usuarios.
2.8. Las cuentas de los usuarios que utilicen información falsa durante el registro serán suspendidas.
 En ocasiones y a nuestra discreción podremos solicitar documentación al usuario para verificar la
  autenticidad de su identidad. Si un usuario se niega a proporcionar la documentación para la verificación
   su cuenta será suspendida.
2.9. Solamente se permite ver anuncios con una cuenta por equipos móviles o computador.

3. INVITADOS

3.1. Puede invitar a tantas personas se lo permita su nivel de usuario.
3.2. Cada uno de sus invitados, como usuarios, debe tener una única dirección de correo electrónico.
3.3. No debe enviar correos electrónicos no solicitados ni engañar ó forzar a nadie de forma alguna
 para que sea su invitado. Tampoco puede utilizar cualquier servicio que intente vender invitados.
  Verificaremos todo tipo de incidentes y podrían resultar en la suspensión de su cuenta.
3.4. Solo ganará por los clicks en anuncios de los invitados obtenidos directamente o por los clicks
 de los invitados de sus invitados según su categoría de usuario,. Nunca generaremos recompensa alguna
  por el solo hecho de vincular personas, todo acumulado siempre se genera por concepto de clickear
   publicidad.
3.5. Un usuario que haya hecho por lo menos una compra nunca podrá modificar al usuario que lo invito
 (Patrocinador Directo). Si nunca ha hecho una compra podrá cambiarlo una sola vez.
3.6. La cantidad de invitados directos que puede tener podría estar limitada según
 su tipo de cuenta/paquete. Puede ver su límite en la página de compra de paquetes.
3.7. La ganancia que obtiene por los anuncios que ven sus invitados está directamente
 relacionada con la cantidad de anuncios que ve usted. Si ve al menos 5 anuncios, recibirá la ganancia
  generada por los clicks de sus referidos. La ganancia de sus invitados será calculada según sus anuncios
   vistos en el día anterior. Estos cálculos están basados en la hora colombiana.

5. PAGOS A LOS CLIENTES

5.1. Enviamos los pagos a nuestros clientes a cualquier tipo de cuenta bancaria ya sea cuenta de ahorros,
 cuenta corriente o ahorro a la mano
5.2. Todos los pagos serán enviados hasta 3 días hábiles después de su solicitud, excepto si los servicios
 del banco no estuvieran disponibles.
5.3. El importe mínimo y máximo para solicitar su pago varía dependiendo de su tipo de cuenta.
 Puede encontrar esa información en el formulario para solicitar pagos. Para cada pago puede ser
  descontada una tarifa si el procesador de pagos utilizado así lo establece.
5.4. Solo puede solicitar un pago al mismo tiempo.
5.5. Solo somos responsables de enviar su pago a la entidad financiera. Cualquier acción posterior
 será manejada por el servicio de soporte de la misma.
5.6. Debe poseer una cuenta bancaria correcta, existente, a su nombre y no compartida con ningún
 otro usuario.
5.7. Tras solicitar un pago, el usuario tendrá que esperar 30 días para poder solicitar otro.
5.8. Cualquier reembolso o devolución de un pago que le enviemos será ignorado y no le será devuelto
 a su cuenta ni enviado de nuevo.
5.9. El formulario para solicitar pagos estará disponible únicamente para usuarios cuyo tipo
 de cuenta NO sea "Gratuita" y que tengan por lo menos un cliente activo en su red de invitados. En
 caso de los clientes cuyos beneficios estén por vencerse en menos de 30 días, se exigirá para la
 renovación de su paquete que tengan en su "Dinero para Compras" lo suficiente para su siguiente compra
  una vez allá echo la recompra en efectivo podrá retirar sus fondos siempre y cuando tenga el monto de
   retiro requerido en su categoría de cliente

6. ANUNCIOS


6.1. Aceptamos cualquier tipo de anuncio excepto páginas que se salgan de los Frames, tengan
 código malicioso, se redirijan a otras páginas, tengan contenido ilegal, como, pero no limitado
 a: venta o consumo de drogas, prostitución, estafas, pornografía o cualquier otra actividad considerada
  ilícita en el territorio colombiano. Cualquier anuncio que utilice el nombre de PUBLICKHAZ CLICK.COM
   para servicios no relacionados no está permitido. Si la página anunciada no termina de cargar en 15
    segundos la barra de progreso comenzará a contar los segundos que lleva viendo el anuncio igualmente.
     La página web anunciada tiene que ser capaz de soportar múltiples visitas por segundo.
6.2. Como usuario, únicamente puede ganar por cada anuncio una vez cada 24 horas. Si en su cuenta
 hubiese Visualizaciones de Banners, Cupo de Anuncios PTC, o Dinero para Compras sin utilizar, se le impedirá clickear anuncios PTC.
6.3. Nos reservamos el derecho de denegar cualquier anuncio cuya exposición no sea apropiada.
6.4. Los usuarios gratuitos no podrán ver anuncios. Para poder hacerlo debes ser usuarios de categoría
 JADE en adelante

7. PAGOS A PUBLICKHAZ CLICK.COM

7.1. Todos los pagos de compras y recompras en las categorías JADE, PERLA, ZAFIRO, RUBY han de ser hechos
 utilizando transferencias o giros únicamente desde los botones de pago que están en nuestra página
  web disponibles en "su cuenta de usuario".
Los clientes que estén en las categorías superior que son ESMERALDA, DIAMANTE, DIAMANTE AZUL,
DIAMANTE NEGRO, DIAMANTE CORONA podrán pagar utilizando el monto generado en su "Acumulado".
 Y también podrán comprar su paquete utilizando transferencias o giros desde los botones de pago
  que están en nuestra página web disponibles en "su cuenta de usuario".
7.2. Ningún pago es reembolsable.
7.3. Ningún cliente ó usuario está autorizado a recaudar dinero en nombre de PUBLICKHAZ CLICK.COM
 revendiendo la publicidad de PUBLICKHAZ CLICK.COM , ó lucrarse cobrando costos adicionales por realizar
  algún procedimiento dentro de la oficina virtual de PUBLICKHAZ CLICK.COM. Se suspenderá permanentemente
   a los usuarios que sean descubiertos infringiendo ésta norma y podría iniciarse el debido proceso legal
    en caso de descubrir personas lucrándose de forma indebida utilizando nuestra marca ó haciéndose pasar
     por funcionarios o vendedores de nuestro establecimiento comercial.

8. SUSPENSIÓN DE CUENTAS

8.1. Tenemos el derecho de suspender permanentemente su cuenta en cualquier momento por, violación
 de nuestros Términos y condiciones de manera repetitiva
8.2. Para toda cuenta suspendida el saldo será puesto a cero, todos los referidos asociados serán
 liberados, y no se hará ningún reembolso. Si el motivo de la suspensión de la cuenta fue por violación
  de términos y condiciones las recompensas generadas a su patrocinador serán anuladas.
8.3. Toda cuenta suspendida será archivada impidiendo la reutilización del nombre de usuario, número
 de cédula o dirección de correo electrónico.
8.4. Para todo usuario que haya comprado por lo menos un paquete publicitario, su cuenta será reseteada
 por inactividad pasados 30 días de la fecha de vencimiento de los beneficios del último paquete
  publicitario que compró, su acumulado y su dinero de compras serán convertidos automáticamente en
   visitas para su anuncio PTC y sus invitados quedarán disponibles nuestra empresa tiene un sistema
    de compresión dinámica lo que significa que pasado 30 días de inactividad de un usuario sus invitados
     pasaran a generar las ganancias a quien invito a quien está inactivo
**aclarando que este luego de haber estado inactivo podrá volver a registrarse para empezar nuevamente
 desde cero**

9. RESPONSABILIDAD

9.1.PUBLICKHAZ CLICK.COM  no será responsable de ningún tipo de retraso o fallo que no esté directamente
 relacionado con PUBLICKHAZ CLICK.COM y que, por tanto, esté fuera de nuestro control.
9.2.PUBLICKHAZ CLICK.COM  se reserva el derecho de alterar los Términos de Servicio en cualquier momento,
 incluyendo tarifas, ofertas especiales, beneficios y reglas, entre otros.
9.3. PUBLICKHAZ CLICK.COM no será responsable de sus usuarios, anunciantes o anuncios. Esto también
 incluye a todos los proveedores de los que dependemos.
9.4. PUBLICKHAZ CLICK.COM no es responsable de ningún impuesto sobre los pagos que recibe por parte
 nuestra. Es su responsabilidad declarar lo que ha recibido y pagar los impuestos correspondientes.
9.5. PUBLICKHAZ CLICK.COM no garantiza una cantidad mínima de anuncios disponibles, es responsabilidad
 de los mismos usuarios publicar los anuncios en el momento de comprar su paquete publicitario.
`;
  }
}
