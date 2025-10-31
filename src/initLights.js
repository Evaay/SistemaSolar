import * as THREE from "three";

export function initLights(scene, sombra, gui) {
  //Luz ambiente, indicando parámetros de color e intensidad
  const Lamb = new THREE.AmbientLight(0xffffff, 0.01);
  scene.add(Lamb);
  const Lamb_Info = gui.addFolder("luz ambiente");
  const Lamb_Params = { color: Lamb.color.getHex() };
  // Control para ajustar intensidad, parámetros con valores extremos e incremento
  Lamb_Info.add(Lamb, "intensity", 0, 1.5, 0.1).name("Intensidad");
  // Control para ajustar el color
  Lamb_Info.addColor(Lamb_Params, "color")
    .name("Color")
    .onChange((value) => Lamb.color.set(value));
  // Abrir panel GUI de luz ambiente
  Lamb_Info.open(); /**/


  //Luz puntual indicando color, intensidad, distancia máxima (0 no límite)
  //const Lpunt = new THREE.PointLight(0xffffff, 1, 0, 1);
  const Lpunt = new THREE.PointLight(0xffffff, 1, 0, 1);
  Lpunt.position.set(0, 0, 0);
  if (sombra) {
    Lpunt.castShadow = true;
  }
  // Asistente para visualizar la luz puntual
  const LpuntHelper = new THREE.PointLightHelper(Lpunt, 0.5);
  scene.add(Lpunt, LpuntHelper);
  // Crear carpeta para la luz puntual
  const Lpunt_Info = gui.addFolder("luz puntual");

  // Parámetros de la luz puntual
  const Lpunt_Params = {
    visible: true,
    color: Lpunt.color.getHex(),
  };
  // Control para ajustar la visibilidad de la luz y su helper
  Lpunt_Info.add(Lpunt_Params, "visible")
    .name("Visible")
    .onChange((value) => {
      Lpunt.visible = value;
      LpuntHelper.visible = value;
    });

  // Control para ajustar la intensidad de la luz puntual
  Lpunt_Info.add(Lpunt, "intensity", 0, 4, 0.1).name("Intensidad");
  // Control para ajustar el color de la luz puntual
  Lpunt_Info.addColor(Lpunt_Params, "color")
    .name("Color")
    .onChange((value) => Lpunt.color.set(value));
  // Abrir la carpeta por defecto
  Lpunt_Info.open();

  scene.add(Lpunt);
}
