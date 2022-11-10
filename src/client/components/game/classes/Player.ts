import controller from '../helpers/controller';
import dynamicSkinLoader from '../helpers/dynamicSkinLoader';
import MainGame from '../scenes/MainGame';
import constants from '../../../../server/helpers/constants';
import lerpTheta from '../helpers/angleInterp';

export default class Player extends Phaser.GameObjects.Container {
  id: string;
  skin: string;
  player: Phaser.GameObjects.Image;
  sword: Phaser.GameObjects.Image;
  mySelf: boolean;
  dir: number;
  force: number;
  lastUpdate: number;
  constructor(scene: Phaser.Scene,
    x: number,
    y: number,
    name: string,
    id: string,
    skin: string,
    angle?: number) {
    super(scene, x, y);
    this.name = name;
    this.id = id;
    this.skin = skin;
    this.mySelf = (this.scene as MainGame).ws.id === this.id;
    this.lastUpdate = Date.now();

    dynamicSkinLoader(this.scene, this.skin).then((data) => {
      this.player = new Phaser.GameObjects.Image(this.scene, 0, 0, data.skin).setScale(0.5);
      this.sword = new Phaser.GameObjects.Image(this.scene, 0, 0, data.sword).setScale(0.5);

      this.add([this.player, this.sword]);

      if (this.mySelf) {
        controller(this.scene as MainGame);
      } else if (this.angle !== undefined) {
        const rads = Phaser.Math.RadToDeg(this.angle);
        this.setDirection(rads);
      }
    });

    this.addToUpdateList();
    this.scene.add.existing(this);
  }

  forceSetDirection(angle: number) {
    this.sword.angle = angle + 45;
    this.player.angle = angle;
    this.sword.x = (this.player.displayWidth * 0.69) * Math.cos(this.sword.rotation);
    this.sword.y = (this.player.displayWidth * 0.69) * Math.sin(this.sword.rotation);
  }

  setDirection(angle1: number) {
    let angle = angle1;
    if (!this.mySelf) angle = Phaser.Math.RadToDeg(angle1);
    if (this.mySelf) {
      this.forceSetDirection(angle);
    } else {
      const startAngle = this.player.angle;
      this.scene.tweens.addCounter({
        from: 0,
        to: 1,
        duration: (1000 / constants.expected_tps),
        onUpdate: (tween) => {
          const angleInterp = lerpTheta(startAngle, angle, tween.getValue());
          this.forceSetDirection(angleInterp);
        },
      });
    }
  }

  move(pos: {x: number, y: number}) {
    this.scene.tweens.add({
      targets: this,
      x: pos.x,
      y: pos.y,
      duration: (1000 / constants.expected_tps) + 30,
      ease: 'Linear',
    });
  }
  // eslint-disable-next-line class-methods-use-this
  preUpdate() {
    const delta = Date.now() - this.lastUpdate;
    this.lastUpdate = Date.now();
  }
}
