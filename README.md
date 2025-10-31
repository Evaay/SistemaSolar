# Sistema Solar
Para esta práctica, se ha decidido realizar el Sistema solar con sus planetas, lunas, y cinturón de asteroides.

## Características principales

### Planetas

* Cada planeta cuenta con su **textura específica base**.
* **Tierra**:
  * Textura base
  * Capa de rugosidad (bump map)
  * Capa especular (specular map)
  * Capa de nubes
* **Marte**:
  * Textura base
  * Capa de rugosidad
* **Saturno y Urano**:
  * Poseen anillos con **texturas aplicadas** que se visualizan alrededor del planeta.

### Lunas
* Cada luna tiene su propia **textura y rugosidad**.
* Las lunas pueden **producir sombras sobre los planetas** alrededor de los cuales orbitan.

### Cinturón de asteroides
* Se incluyen múltiples asteroides simulados empleando para ello un octaedro y texturas.
* Orbitan alrededor del Sol siguiendo trayectorias elípticas simuladas.

## Controles e interacción
* **Seguimiento de planetas**:
  Permite centrar la cámara en un planeta específico y seguirlo.
  Dentro de esta opción, se puede activar un **panel de información** que muestra datos relevantes del planeta seleccionado (masa, diámetro, gravedad, etc.).

* **Tipos de control de cámara**:
  * **OrbitControls**: rotación y zoom mediante ratón.
  * **FlyControls**: movimiento libre por el espacio 3D.

* **Botones de utilidad**:
  * **Restaurar posición inicial**: vuelve la cámara a su posición predeterminada sin recargar la página.
  * **Crear nuevos planetas**: permite colocar planetas adicionales haciendo clic en la escena.
  * **Eliminar planetas creados**: borra todos los planetas generados dinámicamente junto con sus órbitas.
 
### Estructura del código
Para poder trabajar mejor, se optó por dividir parte del código principal en diferentes archivos. Algunas funciones que se llaman desde el código principal y se encuentran en otro archivo, tienen el mismo nombre que sus archivos js correspondientes. Aquí hay un breve resumen de las nuevas funciones:
* initElements(): Incializa todos los elementos del sistema solar completos, exceptuando el cinturón de asteroides.
* Planeta(): Crea un planeta individual con sus propiedades físicas y visuales (textura, bump map, specular, alpha map) y su órbita.
* Luna(): Crea lunas que orbitan un planeta, también con textura y rugosidad, y pueden proyectar sombras.
* ringsPlanet(): Genera anillos para planetas como Saturno y Urano con texturas aplicadas.
* Sun(): Crea el Sol con su textura y velocidad de rotación.
* Sphere(): Permite crear planetas adicionales de forma interactiva al hacer clic, con trayectoria orbital calculada y valores de estilos aleatorios.
* asteroids(): Genera el cinturón de asteroides del sistema solar.
