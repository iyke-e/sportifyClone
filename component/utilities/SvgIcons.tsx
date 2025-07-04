import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Svg } from '@/assets';

type SvgName = keyof typeof Svg;

type Props = {
    name: SvgName;
    onPress?: () => void;
    width?: number;
    height?: number;
    disabled?: boolean;
};

const SvgIconButton = ({
    name,
    onPress,
    width = 24,
    height = 24,
    disabled = false,
}: Props) => {
    const IconComponent = Svg[name];

    if (!IconComponent) {
        console.warn(`Svg icon "${name}" not found in Svg object.`);
        return null;
    }

    return (
        <TouchableOpacity onPress={onPress} disabled={disabled}>
            <IconComponent width={width} height={height} />
        </TouchableOpacity>
    );
};

export default SvgIconButton;
