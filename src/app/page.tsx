'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  Page,
  Navbar,
  Block,
  Button,
  List,
  ListItem,
  BlockTitle,
} from 'konsta/react';

export default function Home() {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    SplashScreen.hide().catch(() => {});

    const backHandler = App.addListener(
      'backButton',
      ({ canGoBack }: { canGoBack: boolean }) => {
        if (!canGoBack) App.exitApp();
        else window.history.back();
      },
    );

    const keyboardShowHandler = Keyboard.addListener('keyboardWillShow', () => {
      document.body.classList.add('keyboard-open');
    });
    const keyboardHideHandler = Keyboard.addListener('keyboardWillHide', () => {
      document.body.classList.remove('keyboard-open');
    });

    return () => {
      backHandler.then((h: { remove: () => void }) => h.remove());
      keyboardShowHandler.then((h: { remove: () => void }) => h.remove());
      keyboardHideHandler.then((h: { remove: () => void }) => h.remove());
    };
  }, []);

  async function takePhoto() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
      });
      setPhoto(image.dataUrl ?? null);
    } catch {
      // user cancelled or permission denied
    }
  }

  return (
    <Page>
      <Navbar title="My App" />

      <Block strong className="flex flex-col items-center gap-4 pt-8 pb-6">
        <Image
          src="/logo.png"
          alt="App Logo"
          width={96}
          height={96}
          className="rounded-2xl"
          priority
        />
        <p className="text-center text-base text-gray-500">
          Next.js · Capacitor · Konsta UI
        </p>
      </Block>

      <BlockTitle>Actions</BlockTitle>
      <List>
        <ListItem
          title="Take a Photo"
          link
          onClick={takePhoto}
          chevronMaterial={false}
        />
      </List>

      {photo && (
        <>
          <BlockTitle>Last Photo</BlockTitle>
          <Block>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt="Captured"
              className="w-full rounded-xl object-cover max-h-64"
            />
          </Block>
        </>
      )}

      <Block className="mt-4">
        <Button onClick={takePhoto} large>
          Open Camera
        </Button>
      </Block>
    </Page>
  );
}
