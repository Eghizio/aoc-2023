package day01.part1

import loadInput

fun main() {
    val input = loadInput("./src/main/kotlin/day01/input")

    val solution = input.lines().map { it ->
        it.split("")
            .filter {
                it.toIntOrNull() !== null
            }.map {
                it.toInt()
            }
    }.sumOf { nums ->
        "${nums.first()}${nums.last()}".toInt()
    }

    println(solution)
}
