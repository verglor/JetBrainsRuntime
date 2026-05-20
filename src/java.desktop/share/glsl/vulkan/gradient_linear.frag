#version 450
#extension GL_GOOGLE_include_directive: require

#define GRADIENT_MAX_FRACTIONS 12 // same as in Metal, see also VkRenderer.h
#include "gradient_common.glsl"

DEFAULT_PUSH_CONSTANTS();
GENERIC_INOUT();

layout(std140, set = 1, binding = 0) uniform LinearGradientUBO {
    vec3 p;
    GradientStops stops;
} u_GradientParams;

void main() {
    float t = dot(vec3(in_Position, 1.0), u_GradientParams.p);
    OUTPUT(convertAlpha(interpolateMultiGradient(t, u_GradientParams.stops)));
}
