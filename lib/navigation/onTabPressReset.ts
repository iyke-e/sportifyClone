import { StackActions } from '@react-navigation/native';

export function onTabPressResetStack(navigation: any) {
  if (navigation.isFocused() && navigation.canGoGoBack()) {
    navigation.dispatch(StackActions.popToTop());
  }
}
