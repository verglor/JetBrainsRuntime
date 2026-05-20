#version 450
#extension GL_GOOGLE_include_directive: require

#define GRADIENT_MAX_FRACTIONS 12 // same as in Metal, see also VkRenderer.h
#include "gradient_common.glsl"

DEFAULT_PUSH_CONSTANTS();
GENERIC_INOUT();

layout(std140, set = 1, binding = 0) uniform RadialGradientUBO {
    vec3 m0;
    vec3 m1;
    vec3 precalc;
    GradientStops stops;
} u_GradientParams;

/*
 * Explanation duplicated from D3DShaderGen.c; The same algorithm is used in MTLPaints.m.
 *
 * To simplify the code and to make it easier to upload a number of
 * uniform values at once, we pack a bunch of scalar (float) values
 * into float3 values below.  Here's how the values are related:
 *
 *   m0.x = m00
 *   m0.y = m01
 *   m0.z = m02
 *
 *   m1.x = m10
 *   m1.y = m11
 *   m1.z = m12
 *
 *   precalc.x = focusX
 *   precalc.y = 1.0 - (focusX * focusX)
 *   precalc.z = 1.0 / precalc.y
 */

void main() {
    float x = dot(vec3(in_Position, 1.0), u_GradientParams.m0);
    float y = dot(vec3(in_Position, 1.0), u_GradientParams.m1);
    float xfx = x - u_GradientParams.precalc.x;
    float t = (u_GradientParams.precalc.x * xfx + sqrt(xfx * xfx + y * y * u_GradientParams.precalc.y)) * u_GradientParams.precalc.z;
    OUTPUT(convertAlpha(interpolateMultiGradient(t, u_GradientParams.stops)));
}
